import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schema = JSON.parse(fs.readFileSync(path.join(root, 'cms/schema.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(path.join(root, 'cms/content.json'), 'utf8'));
const output = path.join(root, 'cms/import');
fs.mkdirSync(output, { recursive: true });
const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = rows => '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n') + '\r\n';
const images = [['collectionId', 'recordTitle', 'fieldId', 'localFile']];

for (const collection of schema.collections) {
  const fields = collection.fields;
  const rows = content[collection.id];
  if (!Array.isArray(rows)) throw new Error(`Missing content: ${collection.id}`);
  const values = rows.map(row => fields.map(field => {
    if (field.type === 'Image') {
      if (row[field.id]) images.push([collection.id, row.title, field.id, row[field.id]]);
      return ''; // Select existing uploaded images with Wix Media Manager after import.
    }
    return row[field.id] ?? '';
  }));
  fs.writeFileSync(path.join(output, `${collection.id}.csv`), csv([fields.map(field => field.id), ...values]));
}
fs.writeFileSync(path.join(root, 'cms/image-map.csv'), csv(images));
// Existing Wix sites import only this new Page Content row, preserving all edits.
const pageFields = schema.collections.find(collection => collection.id === 'AristaPageContent').fields;
const testimonialSection = content.AristaPageContent.filter(row => row.sectionKey === 'testimonials');
fs.writeFileSync(path.join(output, 'AristaPageContent-testimonials-only.csv'), csv([
  pageFields.map(field => field.id),
  ...testimonialSection.map(row => pageFields.map(field => field.type === 'Image' ? '' : row[field.id] ?? '')),
]));
console.log(`Exported ${schema.collections.length} collection CSV files and an image checklist.`);

const recognitionSection = content.AristaPageContent.filter(row => row.sectionKey === 'recognitions');
fs.writeFileSync(path.join(output, 'AristaPageContent-recognitions-only.csv'), csv([
  pageFields.map(field => field.id),
  ...recognitionSection.map(row => pageFields.map(field => field.type === 'Image' ? '' : row[field.id] ?? '')),
]));
