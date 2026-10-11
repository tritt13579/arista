# Arista Wix Site

A Wix Editor Custom Element project with CMS content separated from presentation.

## Structure

- `src/components/`: Custom Element source entry point and lifecycle, without Wix imports.
- `src/sections/`: header, hero, quote, philosophy, programs and shared section markup.
- `src/styles/`: section styles, shared styles, animations and responsive rules.
- `src/utils/`: DOM creation, Wix image URLs, font loading and reveal animations.
- `src/content/`: presentation data adapters.
- `src/wix/`: page code copied into the Wix Editor.
- `cms/schema.json`: collection and field contracts, including dataset IDs.
- `cms/content.json`: editable sample content extracted from the reference design.
- `cms/import/`: generated UTF-8 CSV imports; image cells intentionally blank.
- `cms/image-map.csv`: an image assignment checklist, not a collection import.
- `assets/`: original images and font files, including their license.
- `reference/`: original full-page design; only relative asset paths changed.
- `scripts/`: CSV export and project validation.
- `dist/arista-home.js`: generated standalone Wix source, including all section code and CSS.

## Development

Install Node.js, then run `npm ci` once after cloning (or when the lockfile changes).
Run `npm run build` to create `dist/arista-home.js`, or `npm run dev` to build once
and rebuild automatically when source files change. Keep watch mode running while
using VS Code Live Server from the project root. Open `/index.html` for the current
menu, hero, quote, teaching philosophy and programs preview, or `/reference/index.html`
for the complete reference design. Local preview loads the same bundle as Wix.
Watch mode rebuilds files; Live Server provides HTTP. Reload Wix Preview to load
a newly built bundle. CMS edits do not require a JavaScript build.

Responsive rules live in `src/styles/responsive.css` and use four inclusive
max-width breakpoints: 1280px reduces spacing, 1024px collapses navigation and reduces
card grids to two columns, 768px stacks the hero, and 640px switches cards to one column with
phone spacing. Small-phone text and buttons adapt fluidly without extra width
breakpoints. Test these layouts using the local preview and the Wix test site.

Run `npm run cms:export` after editing sample content. Run `npm run check` to
build and validate schema, CSV consistency, local assets, JavaScript syntax and
standalone bundle registration.

## Wix boundaries

The source URL is `/dist/arista-home.js`; the tag name is `arista-home` and the
Wix element ID remains `aristaHome`. With Live Server on port 5500, the local URL is
`http://127.0.0.1:5500/dist/arista-home.js`. If using an HTTPS tunnel to that server,
keep the tunnel hostname and change the path to `/dist/arista-home.js`.
Do not point Wix at `src/components/arista-home.js`: that is now a source module
with imports and must be bundled first. No separate section or CSS URLs are needed.
Page code is `src/wix/arista-preview.page.js`. Do not upload page code as a Custom
Element source. Use an HTTPS host for deployment; localhost is development only.
The page code, CMS field IDs and four dataset IDs are unchanged by this refactor.

For deployment, run `npm ci` and `npm run build`, then serve the generated
`dist/arista-home.js` with a JavaScript content type over HTTPS. `dist/` is ignored
by Git: pushing source code alone does not publish a new bundle. Configure the host
to run the build or upload the generated file to the existing static host.
Upload the file again after code changes and reload the test site (bypass browser
cache if needed). Keep the same URL to avoid changing Wix settings each time.
Images and Google Fonts remain separate requests; only section JavaScript and CSS
are embedded in the bundle. Source files should be edited, never the generated file.

### GitHub Pages deployment

`.github/workflows/deploy-pages.yml` installs dependencies, builds and validates the
project, then deploys only `dist/` to Pages on pushes to `main`. It can also be run
manually from the Actions tab. Enable Settings > Pages > Build and deployment >
Source > GitHub Actions before the first run. Commit the workflow, source files,
`package.json` and `package-lock.json`; keep `dist/` ignored.

For the `tritt13579/arista` repository without a custom Pages domain, the expected
Wix Server URL after successful deployment is
`https://tritt13579.github.io/arista/arista-home.js` (no `/dist/` in this URL because
the contents of `dist/` become the published root). Confirm the URL from the Pages
deployment before using it in Wix. This deployment serves the component bundle,
not the local preview HTML, sample content, images or Wix page code. Production
images come from Wix CMS/Media Manager. No personal access token is required.

Once Wix uses this URL, successful pushes to `main` update the component available
to all Wix pages that load it, including published pages. Use local/tunnel development
for unfinished work and push to `main` when the update is ready to deploy.

The current renderer implements menu, hero, quote, teaching philosophy and programs.
It requires four read-only datasets: `pageContentDataset`, `heroHighlightsDataset`,
`philosophyDataset` and `programsDataset`. Do not add dataset sorts when mirroring CMS order.
Navigation scrolls to rendered sections. Program buttons emit `arista-action` with
`target: 'registration'` and `programName`; native Wix Forms integration is pending.
Other collections contain seed content for later sections.
The fixed header lives outside the hero clipping container. It follows the component
width, changes background after 40px of scrolling, and reserves its measured height
when navigating to sections. Font faces are loaded once in the document head so
they are available to the Shadow DOM; desktop type sizes follow the reference.
Wix Editor/Preview renders Custom Elements in an iframe: fixed positioning and
scroll events are relative to that iframe, not the outer Wix page. Validate final
header behavior on a Wix test site before assuming Preview matches the live site.
The Wix Editor element height must accommodate all rendered sections on desktop
and mobile; the component does not automatically resize the Wix element wrapper.

The old `wix-assets/` experiment paths have been retired. Update the development
page source URL and page code before testing. This repository does not publish,
delete, or modify the client's Wix site or collections automatically.
