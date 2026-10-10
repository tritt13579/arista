# Arista Wix Site

A Wix Editor Custom Element project with CMS content separated from presentation.

## Structure

- `src/components/`: standalone browser Custom Elements, without Wix imports.
- `src/content/`: presentation data adapters.
- `src/wix/`: page code copied into the Wix Editor.
- `cms/schema.json`: collection and field contracts, including dataset IDs.
- `cms/content.json`: editable sample content extracted from the reference design.
- `cms/import/`: generated UTF-8 CSV imports; image cells intentionally blank.
- `cms/image-map.csv`: an image assignment checklist, not a collection import.
- `assets/`: original images and font files, including their license.
- `reference/`: original full-page design; only relative asset paths changed.
- `scripts/`: CSV export and project validation.

## Development

Use VS Code Live Server from the project root. Open `/index.html` for the current
menu/hero preview, or `/reference/index.html` for the complete reference design.
No dependency installation or build is required.

Run `npm run cms:export` after editing sample content. Run `npm run check` to
validate schema, CSV consistency, local assets, and JavaScript syntax.

## Wix boundaries

The source URL is `/src/components/arista-home.js`; the tag name is `arista-home`.
Page code is `src/wix/arista-preview.page.js`. Do not upload page code as a Custom
Element source. Use an HTTPS host for deployment; localhost is development only.

The current renderer implements menu and hero. The remaining collections contain
seed content for later sections, not completed UI implementations. Navigation
actions are emitted, but section scrolling and Wix Forms integration are pending.

The old `wix-assets/` experiment paths have been retired. Update the development
page source URL and page code before testing. This repository does not publish,
delete, or modify the client's Wix site or collections automatically.
