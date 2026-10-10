import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { createHomeContent } from '../src/content/home-content.js';

const schema = JSON.parse(fs.readFileSync('cms/schema.json','utf8'));
const content = JSON.parse(fs.readFileSync('cms/content.json','utf8'));
assert.equal(schema.collections.length,12);
const ids = new Set();
const datasets = new Set();
function readCsv(text) {
  const rows=[];let row=[],cell='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++) {
    const char=text[i];
    if(char==='"') { if(quoted && text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted; }
    else if(char===',' && !quoted){row.push(cell);cell='';}
    else if(char==='\n' && !quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell='';}
    else cell+=char;
  }
  assert.equal(quoted,false,'Unclosed CSV quote');
  return rows;
}
for(const collection of schema.collections) {
  assert.ok(!ids.has(collection.id));ids.add(collection.id);
  if(collection.datasetId){assert.ok(!datasets.has(collection.datasetId));datasets.add(collection.datasetId);}
  const fields=new Map(collection.fields.map(field=>[field.id,field]));
  assert.equal(fields.size,collection.fields.length);
  assert.ok(fields.has('title'));
  const rows=content[collection.id];
  for(const row of rows) {
    assert.ok(row.title);
    for(const [key,value] of Object.entries(row)) {
      assert.ok(fields.has(key),`Unknown field ${collection.id}.${key}`);
      const type=fields.get(key).type;
      if(type==='Boolean')assert.equal(typeof value,'boolean');
      else assert.equal(typeof value,'string');
      if(type==='Image' && value)assert.ok(fs.existsSync(value),`Missing image ${value}`);
      if(type==='URL' && value)assert.equal(new URL(value).protocol,'https:');
    }
  }
  const csv=readCsv(fs.readFileSync(`cms/import/${collection.id}.csv`,'utf8'));
  assert.deepEqual(csv[0],collection.fields.map(field=>field.id));
  assert.equal(csv.length,rows.length+1);
  csv.slice(1).forEach((row,index)=>{
    assert.equal(row.length,collection.fields.length);
    collection.fields.forEach((field,column)=>assert.equal(row[column],field.type==='Image'?'':String(rows[index][field.id]??'')));
  });
}
assert.equal(datasets.size,11);
assert.equal(content.AristaSiteSettings.length,1);
assert.equal(content.AristaTeachers.filter(item=>item.featured && item.show).length,1);
assert.equal(new Set(content.AristaPageContent.map(item=>item.sectionKey)).size,10);
const home=createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,content.AristaHeroHighlights);
assert.equal(home.menu.length,6);assert.equal(home.stats.length,4);
const swapped=[content.AristaHeroHighlights[1],content.AristaHeroHighlights[0],...content.AristaHeroHighlights.slice(2)];
assert.deepEqual(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,swapped).stats.map(item=>item.value),['15+','43','8','11K']);
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showInMenu:false})),[]).menu.length,0);
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showSection:item.sectionKey!=='hero'})),[]).hero,null);
function checkJs(dir) {
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
    const file=path.join(dir,entry.name);
    if(entry.isDirectory())checkJs(file);
    else if(/\.(m?js)$/.test(file))execFileSync(process.execPath,['--check',file],{stdio:'pipe'});
  }
}
checkJs('src');checkJs('scripts');
const reference=fs.readFileSync('reference/index.html','utf8');
for(const match of reference.matchAll(/(?:\.\.\/)?assets\/images\/[A-Za-z0-9_./~-]+/g))assert.ok(fs.existsSync(match[0].replace(/^\.\.\//,'')),`Missing reference asset: ${match[0]}`);
// Verify that the standalone Wix page code matches the local adapter contract.
const events={};const ready=[];let wixPayload;let writes=0;
const component={on(name,handler){events[name]=handler;},setAttribute(name,value){
  assert.equal(name,'content');assert.ok(++writes<10,'Repeated ready feedback loop');
  wixPayload=JSON.parse(value);events['arista-ready']?.();
}};
function dataset(rows){return {onReady(handler){ready.push(handler);},getTotalCount(){return rows.length;},async getItems(start,count){return {items:rows.slice(start,start+count)};}};}
const handles={
  '#aristaHome':component,
  '#pageContentDataset':dataset(content.AristaPageContent),
  '#heroHighlightsDataset':dataset(swapped)
};
const $w=id=>{assert.ok(handles[id],`Unknown handle ${id}`);return handles[id];};
$w.onReady=handler=>handler();
const wixData={query(id){assert.equal(id,'AristaSiteSettings');return {limit(){return this;},async find(){return {items:content.AristaSiteSettings};}};}};
vm.runInNewContext(fs.readFileSync('src/wix/arista-preview.page.js','utf8').replace("import wixData from 'wix-data';",''),{$w,wixData,console:{info(){},error(){}}});
ready.reverse().forEach(handler=>handler());
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(wixPayload,JSON.parse(JSON.stringify(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,swapped))));
console.log('PASS: 12 schemas/CSVs, 11 dataset IDs, sample data, image paths, multiline CSV round-trip, ordered home adapter, mocked Wix payload parity and JavaScript syntax. Wix runtime and visual layout require Preview verification.');
