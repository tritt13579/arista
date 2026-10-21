import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { createHomeContent } from '../src/content/home-content.js';
import { imageFocusPosition } from '../src/utils/image-focus.js';
import { contactHref } from '../src/sections/floating-contacts.js';
import { responsiveImage } from '../src/utils/image-url.js';
import { thumbnailImageRect } from '../src/utils/thumbnail-transition.js';
import { heroCollageItems, heroArcCoordinates, heroArcPosition } from '../src/sections/hero-collage.js';

const heroSources = {
  heroImages: [{ title: 'Selected', image: 'https://example.com/a.jpg', show: true },
    { title: 'Hidden', image: 'https://example.com/hidden.jpg', show: false },
    { title: 'No image', image: '', show: true },
    { title: 'Next', image: 'https://example.com/b.jpg', show: true }],
  recognitions: { items: [{ title: 'Unselected', image: 'https://example.com/c.jpg', show: true }] },
};
assert.deepEqual(heroCollageItems(heroSources).map(item => item.title), ['Selected', 'Next']);
assert.deepEqual(heroCollageItems({ heroImages: [...heroSources.heroImages].reverse() }).map(item => item.title), ['Next', 'Selected']);
assert.equal(heroCollageItems({}).length, 0);
assert.equal(heroCollageItems({ heroImages: [], recognitions: heroSources.recognitions }).length, 0);
assert.equal(heroCollageItems({ heroImages: Array.from({ length: 125 }, (_, i) => ({ image: `https://example.com/${i}.jpg`, show: true })) }).length, 125);
for (const count of [1, 2, 5, 10, 11, 25, 125]) {
  const points = Array.from({ length: count }, (_, i) => heroArcPosition(i, count));
  assert.equal(new Set(points.map(p => p.join(','))).size, count, 'Each image has its own position');
  assert.ok(points.every(([left, top, width, ...turns]) => left >= 0 && top >= 0 && 100 - left - width >= 0 && turns.every(Number.isFinite)));
}
assert.deepEqual(heroArcPosition(0, 10), heroArcCoordinates[0]);
assert.deepEqual(heroArcPosition(9, 10), heroArcCoordinates[9]);

const thumbnailBox = { left: 10, top: 20, width: 420, height: 320 };
const thumbnailStyle = { objectFit: 'contain', objectPosition: '50% 50%', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px' };
assert.deepEqual(thumbnailImageRect(thumbnailBox, thumbnailStyle, 200, 400), { left: 145, top: 30, width: 150, height: 300 });
assert.deepEqual(thumbnailImageRect(thumbnailBox, thumbnailStyle, 400, 200), { left: 20, top: 80, width: 400, height: 200 });
assert.deepEqual(thumbnailImageRect(thumbnailBox, { ...thumbnailStyle, objectFit: 'cover' }, 200, 400), { left: 20, top: 30, width: 400, height: 300 });

const mediaUrl = 'https://static.wixstatic.com/media/example~mv2.jpg';
const responsive = responsiveImage(mediaUrl, '50vw');
assert.equal(responsive.sizes, '50vw');
assert.ok(responsive.srcset.includes('/v1/fit/w_640,h_5000/file.webp 640w'));
assert.ok(!responsive.srcset.includes('/fill/'), 'Keep CMS focal position in CSS');
const smallOriginal = responsiveImage('wix:image://v1/example~mv2.png/photo.png#originWidth=500&originHeight=1000');
assert.ok(smallOriginal.srcset.endsWith('w_500,h_5000/file.webp 500w'), 'Do not upscale known originals');
for (const url of ['https://example.com/image.jpg', 'http://127.0.0.1:5500/assets/image.jpg', mediaUrl + '/v1/fit/w_400,h_400/file.jpg', 'https://static.wixstatic.com/media/animated.gif', 'https://static.wixstatic.com/media/logo.svg']) {
  assert.equal(responsiveImage(url).src, url);
  assert.equal(responsiveImage(url).srcset, '');
}
assert.equal(responsiveImage('javascript:alert(1)').src, '');

assert.equal(contactHref('093.567.2244', true), 'tel:0935672244');
assert.equal(contactHref('+84 (935) 672-244', true), 'tel:+84935672244');
for (const value of ['', 'javascript:alert(1)', 'http://example.com']) assert.equal(contactHref(value), '');
assert.equal(contactHref('https://zalo.me/0935672244'), 'https://zalo.me/0935672244');

assert.equal(imageFocusPosition(0), 'center 0%');
assert.equal(imageFocusPosition(30), 'center 30%');
assert.equal(imageFocusPosition(100), 'center 100%');
for (const value of [undefined, null, '', '30', NaN, Infinity]) {
  assert.equal(imageFocusPosition(value), 'center 50%');
}
assert.equal(imageFocusPosition(undefined, 20), 'center 20%');
assert.equal(imageFocusPosition(-10), 'center 0%');
assert.equal(imageFocusPosition(150), 'center 100%');

const schema = JSON.parse(fs.readFileSync('cms/schema.json','utf8'));
const content = JSON.parse(fs.readFileSync('cms/content.json','utf8'));
assert.equal(schema.collections.length,15);
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
  for (const field of collection.fields.filter(field => field.type === 'Image')) {
    assert.equal(fields.get(`${field.id}FocusHeight`)?.type, 'Number', `Missing focus field for ${collection.id}.${field.id}`);
  }
  assert.equal(fields.size,collection.fields.length);
  assert.ok(fields.has('title'));
  const rows=content[collection.id];
  for(const row of rows) {
    assert.ok(row.title);
    for(const [key,value] of Object.entries(row)) {
      assert.ok(fields.has(key),`Unknown field ${collection.id}.${key}`);
      const type=fields.get(key).type;
      if(type==='Boolean')assert.equal(typeof value,'boolean');
      else if(type==='Number'){assert.equal(typeof value,'number');assert.ok(Number.isFinite(value));}
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
assert.equal(datasets.size,14);
assert.equal(content.AristaSiteSettings.length,1);
assert.equal(content.AristaTeachers.filter(item=>item.featured && item.show).length,1);
assert.equal(new Set(content.AristaPageContent.map(item=>item.sectionKey)).size,12);
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
// The Wix URL must be a standalone classic script, with CSS embedded and no module loader.
const bundle = fs.readFileSync('dist/arista-home.js', 'utf8');
for (const filename of ['dist/arista-home.js', 'dist/arista-program.js']) {
  assert.ok(!/\bglobalThis\b/.test(fs.readFileSync(filename, 'utf8')), `${filename}: avoid globalThis, which Wix publish lint does not recognize`);
}
const registry = new Map();
const customElements = { get: name => registry.get(name), define: (name, element) => registry.set(name, element) };
const runtime = { HTMLElement: class {}, customElements };
new vm.Script(bundle).runInNewContext(runtime);
assert.equal(typeof registry.get('arista-home'), 'function');
assert.deepEqual(Array.from(registry.get('arista-home').observedAttributes), ['content', 'registration-result']);
const registeredElement = registry.get('arista-home');
new vm.Script(bundle).runInNewContext(runtime);
assert.equal(registry.get('arista-home'), registeredElement, 'Loading the bundle twice must not register twice');
const reference=fs.readFileSync('reference/index.html','utf8');
for(const match of reference.matchAll(/(?:\.\.\/)?assets\/images\/[A-Za-z0-9_./~-]+/g))assert.ok(fs.existsSync(match[0].replace(/^\.\.\//,'')),`Missing reference asset: ${match[0]}`);
// A missing/misidentified dataset should name the exact selector, not throw onReady.
const datasetReaderSource = fs.readFileSync('src/wix/arista-preview.page.js', 'utf8').split('function readDataset(dataset, selector)')[1];
const readWixDataset = vm.runInNewContext('(function(dataset, selector)' + datasetReaderSource + ')');
await assert.rejects(readWixDataset({}, '#heroImagesDataset'), /#heroImagesDataset.*không phải dataset/);
await assert.rejects(readWixDataset(undefined, '#heroImagesDataset'), /Element ID heroImagesDataset/);
// Verify that the standalone Wix page code matches the local adapter contract.
const events={};const ready=[];let wixPayload;let writes=0;let registrationResult;
const component={on(name,handler){events[name]=handler;},setAttribute(name,value){
  if (name === 'registration-result') { registrationResult = JSON.parse(value); return; }
  assert.equal(name,'content');assert.ok(++writes<10,'Repeated ready feedback loop');
  wixPayload=JSON.parse(value);events['arista-ready']?.();
}};
function dataset(rows){return {onReady(handler){ready.push(handler);},getTotalCount(){return rows.length;},async getItems(start,count){return {items:rows.slice(start,start+count)};}};}
const handles={
  '#quickActionBar1': { async hide() {} },
  '#aristaHome':component,
  '#pageContentDataset':dataset(content.AristaPageContent),
  '#heroHighlightsDataset':dataset(swapped),
  '#philosophyDataset':dataset(content.AristaTeachingPhilosophy),
  '#programsDataset':dataset(content.AristaPrograms),
  '#learningJourneyDataset':dataset(content.AristaLearningJourney),
  '#teachersDataset':dataset(content.AristaTeachers),
  '#achievementsDataset':dataset(content.AristaAchievements),
  '#awardCountsDataset':dataset(content.AristaAwardCounts),
  '#achievementPhotosDataset':dataset(content.AristaAchievementPhotos),
  '#studentMomentsDataset':dataset(content.AristaStudentMoments),
  '#faqDataset':dataset(content.AristaFaq),
  '#testimonialsDataset':dataset(content.AristaTestimonials),
  '#recognitionsDataset':dataset(content.AristaRecognitions),
  '#heroImagesDataset':dataset(content.AristaHeroImages)
};
const $w=id=>{assert.ok(handles[id],`Unknown handle ${id}`);return handles[id];};
$w.onReady=handler=>handler();
const wixData={query(id){assert.equal(id,'AristaSiteSettings');return {limit(){return this;},async find(){return {items:content.AristaSiteSettings};}};}};
vm.runInNewContext(fs.readFileSync('src/wix/arista-preview.page.js','utf8').replace(/^import .*;$/gm, ''),{$w,wixData,submitTrialRegistration: async () => ({ok:true}),console:{info(){},error(){}}});
ready.reverse().forEach(handler=>handler());
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(wixPayload,JSON.parse(JSON.stringify(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,swapped,content.AristaTeachingPhilosophy,content.AristaPrograms,content.AristaLearningJourney,content.AristaTeachers,content.AristaAchievements,content.AristaAwardCounts,content.AristaAchievementPhotos,content.AristaStudentMoments,content.AristaFaq,content.AristaTestimonials,content.AristaRecognitions,content.AristaHeroImages))));
assert.deepEqual(wixPayload.heroImages, content.AristaHeroImages.filter(item => item.show));
assert.equal(wixPayload.testimonials.items.length, 6);
const reorderedTestimonials = [...content.AristaTestimonials].reverse().map((item,index)=>({...item,show:index!==1}));
const testimonialPayload = createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],[],[],[],[],[],[],[],reorderedTestimonials).testimonials;
assert.deepEqual(testimonialPayload.items,reorderedTestimonials.filter(item=>item.show));
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showSection:item.sectionKey!=='testimonials'})),[],[],[],[],[],[],[],[],[],[],reorderedTestimonials).testimonials,null);
const testimonialDelta = readCsv(fs.readFileSync('cms/import/AristaPageContent-testimonials-only.csv','utf8'));
const pageFields = schema.collections.find(collection=>collection.id==='AristaPageContent').fields.map(field=>field.id);
assert.equal(testimonialDelta.length,2,'Delta import must contain only one new section');
assert.equal(testimonialDelta[1][pageFields.indexOf('sectionKey')],'testimonials');
assert.equal(wixPayload.faq.items.length, 4);
assert.equal(wixPayload.registration.locationImage, content.AristaSiteSettings[0].locationImage);
assert.deepEqual(wixPayload.registration.programs, content.AristaPrograms.filter(item => item.show).map(item => item.title));
await events['arista-registration-submit']({detail:{requestId:'test-request',values:{}}});
assert.deepEqual(registrationResult, {ok:true,requestId:'test-request'});
assert.equal(wixPayload.footer.description, content.AristaSiteSettings[0].footerDescription);
assert.equal(wixPayload.contacts.phone, content.AristaSiteSettings[0].primaryPhone);
assert.equal(wixPayload.contacts.registrationLabel, content.AristaSiteSettings[0].floatingRegistrationButtonText);
const reorderedFaq = [...content.AristaFaq].reverse().map((item, index) => ({ ...item, show: index !== 1 }));
const faqPayload = createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],[],[],[],[],[],[],reorderedFaq).faq;
assert.deepEqual(faqPayload.items, reorderedFaq.filter(item => item.show));
assert.equal(faqPayload.phone, content.AristaSiteSettings[0].primaryPhone);
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item => ({...item,showSection:item.sectionKey !== 'faq'})),[],[],[],[],[],[],[],[],[],reorderedFaq).faq, null);
assert.equal(wixPayload.moments.items.length,8);
assert.equal(wixPayload.moments.socialLinks[0].url,content.AristaSiteSettings[0].youtubeUrl);
const changedMoments = [...content.AristaStudentMoments].reverse().map((item,index)=>({...item,show:index!==1}));
assert.deepEqual(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],[],[],[],[],[],changedMoments).moments.items,changedMoments.filter(item=>item.show));
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showSection:item.sectionKey!=='moments'})),[],[],[],[],[],[],[],[],changedMoments).moments,null);
assert.equal(wixPayload.achievements.items.length,6);
assert.equal(wixPayload.achievements.counts.length,4);
assert.equal(wixPayload.achievements.photos.length,6);
const changedAwards = [...content.AristaAchievements].reverse().map((item,index)=>({...item,show:index!==1}));
const changedCounts = [...content.AristaAwardCounts].reverse().map((item,index)=>({...item,show:index!==1}));
const changedPhotos = [...content.AristaAchievementPhotos].reverse().map((item,index)=>({...item,show:index!==1}));
const changedAchievements = createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],[],[],changedAwards,changedCounts,changedPhotos).achievements;
assert.deepEqual(changedAchievements.items,changedAwards.filter(item=>item.show));
assert.deepEqual(changedAchievements.counts,changedCounts.filter(item=>item.show));
assert.deepEqual(changedAchievements.photos,changedPhotos.filter(item=>item.show));
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showSection:item.sectionKey!=='achievements'})),[],[],[],[],[],changedAwards,changedCounts,changedPhotos).achievements,null);
assert.equal(wixPayload.teachers.items.length,6);
const changedTeachers = [...content.AristaTeachers].reverse().map((item,index)=>({...item,show:index!==1}));
assert.deepEqual(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],[],changedTeachers).teachers.items.map(item=>item.title),changedTeachers.filter(item=>item.show).map(item=>item.title));
assert.equal(wixPayload.learningJourney.items.length,5);
const reorderedJourney = [...content.AristaLearningJourney].reverse().map((item,index)=>({...item,show:index!==1}));
const journeyPayload = createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent,[],[],[],reorderedJourney);
assert.deepEqual(journeyPayload.learningJourney.items.map(item=>item.title),reorderedJourney.filter(item=>item.show).map(item=>item.title));
assert.equal(createHomeContent(content.AristaSiteSettings[0],content.AristaPageContent.map(item=>({...item,showSection:item.sectionKey!=='learning-journey'})),[],[],[],reorderedJourney).learningJourney,null);
assert.equal(wixPayload.philosophy.items.length,4);
assert.equal(wixPayload.programs.items.length,8);
const changedPrograms = [...content.AristaPrograms].reverse().map((item,index)=>({...item,show:index!==1}));
const hiddenSections = content.AristaPageContent.map(item=>({...item,showSection:!['quote','philosophy'].includes(item.sectionKey)}));
const changed = createHomeContent(content.AristaSiteSettings[0],hiddenSections,[],[],changedPrograms);
assert.equal(changed.quote,null);assert.equal(changed.philosophy,null);
assert.deepEqual(changed.programs.items.map(item=>item.title),changedPrograms.filter(item=>item.show).map(item=>item.title));


assert.equal(wixPayload.recognitions.items.length, 7);
assert.equal(wixPayload.recognitions.items[0].category, 'Trung tâm');
assert.equal(new Set(wixPayload.recognitions.items.map(item => item.image)).size, 7);
const recognitionDelta = readCsv(fs.readFileSync('cms/import/AristaPageContent-recognitions-only.csv', 'utf8'));
assert.equal(recognitionDelta.length, 2);
assert.equal(recognitionDelta[1][pageFields.indexOf('sectionKey')], 'recognitions');

console.log('PASS: 15 schemas/CSVs, 14 dataset IDs, section delta CSVs, sample data, image paths, CSV round-trip, home adapter, Wix payload parity and JavaScript syntax.');

