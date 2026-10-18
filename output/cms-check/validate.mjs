import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { Workbook } from '@oai/artifact-tool';
const data = JSON.parse(await fs.readFile('cms/program-content.json', 'utf8'));
const schema = JSON.parse(await fs.readFile('cms/program-schema.json', 'utf8'));
const home = JSON.parse(await fs.readFile('cms/content.json', 'utf8'));
const homeSchema = JSON.parse(await fs.readFile('cms/schema.json', 'utf8'));
const tables = [...schema.collections.map(c => ({ ...c, rows: data[c.id], path: `cms/program-import/${c.id}.csv` })), { ...homeSchema.collections.find(c => c.id === 'AristaPrograms'), rows: home.AristaPrograms, path: 'cms/import/AristaPrograms.csv' }];
for (const table of tables) {
  const csv = (await fs.readFile(table.path, 'utf8')).replace(/^\uFEFF/, '');
  const wb = await Workbook.fromCSV(csv, { sheetName: 'Import' });
  const sheet = wb.worksheets.getItem('Import');
  const letters = String.fromCharCode(64 + table.fields.length);
  const values = sheet.getRange(`A1:${letters}${table.rows.length + 1}`).values;
  assert.deepEqual(values[0], table.fields.map(f => f.id));
  for (let i = 0; i < table.rows.length; i++) {
    const expected = table.fields.map(f => f.type === 'Image' ? '' : String(table.rows[i][f.id] ?? ''));
    assert.deepEqual(values[i + 1].map(v => String(v ?? '')), expected, `${table.id} row ${i + 1}`);
  }
  console.log(`${table.id}: ${table.rows.length} rows verified with Artifact Tool, including Vietnamese and multiline fields.`);
}
