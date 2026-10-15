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
At 1024px and below, the two-line menu toggle opens a full-viewport navy modal
with numbered CMS navigation items and a registration CTA. The modal traps focus,
supports Escape/close, locks background scrolling and restores styles on close or
disconnect. It closes when returning to desktop. The CTA uses the existing action
event; the registration section submits through the Wix backend web method. Editor/Preview iframes limit
the modal to the iframe viewport, so verify fullscreen behavior on the Wix test site.

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

The current renderer implements menu, hero, quote, teaching philosophy, programs, learning journey, teachers, achievements and student moments.
It requires eleven read-only datasets: `pageContentDataset`, `heroHighlightsDataset`,
`philosophyDataset`, `programsDataset`, `learningJourneyDataset`, `teachersDataset`,
`achievementsDataset`, `awardCountsDataset`, `achievementPhotosDataset`, `studentMomentsDataset` and `faqDataset`. Do not add dataset sorts when mirroring CMS order.
Connect `learningJourneyDataset` to `AristaLearningJourney`. Journey numbers follow the visible item order;
edit the section heading and description in the Learning Journey record of `AristaPageContent`.
Connect `teachersDataset` to `AristaTeachers`. Enable `featured` for one visible teacher to show the large profile;
the remaining visible teachers follow CMS order in the team grid. If no teacher is featured, only the team is shown.
If multiple teachers are featured, the first in CMS order receives the large profile.
Each line of `qualifications` becomes a list item. The Teachers record in `AristaPageContent` supplies the team
heading/description and optional `primaryButtonText` for a registration action with `teacherName`.
Connect the three achievement datasets to `AristaAchievements`, `AristaAwardCounts` and `AristaAchievementPhotos` respectively.
The Achievements record in `AristaPageContent` supplies `featuredValue`, `featuredLabel`, `image`, `imageDescription` and `caption`.
The headline value is editorial content, not an automatic sum of the award counts.
Connect `studentMomentsDataset` to `AristaStudentMoments`; `title` supplies the caption and image alt text.
The Moments record in `AristaPageContent` supplies its intro, heading and description.
Visible images follow mirrored CMS order. The responsive mosaic emphasizes the first photos without additional layout fields.
YouTube/Facebook links, titles and descriptions come from `AristaSiteSettings`;
empty or non-HTTPS links are omitted. Student moments reuse the same image viewer as achievements.
The page previews up to 8 student moments and 8 achievement gallery photos (plus the main achievement photo).
When there are more valid photos, the last preview becomes a stacked album card with a small `+N áº£nh` badge; every preview opens the full section gallery.
The overlay brightens slightly on hover with a fine pointer; reduced-motion preferences disable the transition.
Extra photos are not rendered as page thumbnails. CMS `show: false` items remain excluded from both previews and the viewer.
Achievement lists, counts and photos preserve mirrored CMS order and respect `show`.
Photos open in a shared image viewer with previous/next controls, arrow keys, Escape and focus restoration;
Opening expands a temporary image from the clicked thumbnail to the contained full-image frame (480ms); closing via Close, Escape or backdrop returns to the current thumbnail (420ms).
Both zoom directions use uniform transform scaling and an inset crop with gentle acceleration/deceleration and fixed frame dimensions. The resting thumbnail stays hidden until completion to avoid overlapping photos. Photos beyond the page preview limit have no thumbnail target and close with a stationary 200ms fade instead of returning to the eighth gallery thumbnail.
The moving frame smoothly changes crop and corner radius; the source thumbnail is temporarily hidden on entry to avoid duplicate images. Controls fade in slightly later and fade out before the return finishes.
This uses browser-native Web Animations, with no animation library. Reduced motion and missing image geometry skip zoom; resize cancels outdated geometry and programmatic closes clean up immediately.
switching clears the old photo and shows the selected photo's decoded thumbnail while its original loads in a stable frame.
Clicked photos reuse their loaded thumbnail URL; other public Wix photos request a 640px preview. When no separate preview is available, the loading message remains until the original is ready.
Only the latest selection can update the viewer. Originals replace previews after decoding without replaying the slide animation.
Failed originals retain the preview with a quality warning; if neither image loads, the viewer shows its normal error. Each ready original prefetches one next original.
the viewer blocks wheel, single-touch and scroll-key input without changing the Wix page's root overflow or scrollbar width.
Long captions can scroll inside the dialog. Focus/scroll are restored only when needed;
updating section content or disconnecting the component closes the viewer and clears its pending frame.
Navigation scrolls to rendered sections. Program buttons emit `arista-action` with
`target: 'registration'` and `programName`; the registration form preselects the matching program.
Other collections contain seed content for later sections.
Footer and floating contacts read existing Site Settings fields, with no additional dataset.
Footer uses `logo`, `logoFocusHeight`, `brandName`, `footerDescription` and `copyrightText`.
The logo returns to the top. Floating contacts use `primaryPhone`, `callButtonText`,
`zaloUrl`, `zaloButtonText`, `messengerUrl`, `messengerButtonText` and `floatingRegistrationButtonText`.
Missing labels or invalid links omit the corresponding contact; external URLs require HTTPS.
The floating bar appears after scrolling 70% of the viewport height from the component top,
stays within the component's horizontal bounds and uses a compact layout on mobile.
Footer bottom padding reserves space for it. Native modal dialogs remain above the bar.
The trial button navigates to the Registration form.
Connect `faqDataset` to `AristaFaq`. Question (`title`), Answer (`answer`) and Show Item
(`show`) use mirrored CMS order. Each question uses native details/summary, starts closed,
and can be toggled independently with pointer, Enter or Space. Answers preserve line breaks.
The FAQ record in Page Content supplies intro/heading/optional description and section visibility.
Site Settings supplies `faqContactText`, `primaryPhone` and `primaryPhoneLabel` for the call link;
empty or invalid phone numbers omit the contact line. No extra collection fields are required.

Every Image field has a companion Number field named `<imageFieldId>FocusHeight`:
`imageFocusHeight`, `photoFocusHeight`, `logoFocusHeight` or `locationImageFocusHeight`.
Use 0 for the top, 50 for the center and 100 for the bottom. The shared
`src/utils/image-focus.js` helper clamps finite numbers to 0â€“100 and ignores invalid values.
For existing content without the new fields, Hero retains 40 and teacher portraits retain 20;
all other images default to 50. Explicit 0 is supported. Seed content preserves those defaults
and the reference focal points for Student Moments.
The header logo uses contain, so focus changes alignment only when its box has spare space.
The full-size image viewer uses contain and keeps showing the entire image.
`locationImageFocusHeight` controls the location image in Registration.
After adding the fields in Wix, replace the dev page code with the latest
`src/wix/arista-preview.page.js` to forward Hero and logo focus values.
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


## Responsive Wix images

`src/utils/image-url.js` creates WebP fit variants for public Wix JPG/PNG/WebP
media. Renderers set `srcset` and `sizes` for their layout; the browser chooses a
candidate based on viewport and pixel density. Known original dimensions cap
the candidates. The entire image is resized, preserving the CSS focal point.
The image viewer retains the original URL for full quality, using a separate preview when available. SVG, GIF,
external URLs, already transformed URLs and local assets are left unchanged.
A failed variant retries the original once, then uses the section error state.
Hero keeps high fetch priority; section images keep native lazy loading.
This change does not add background prefetching or change any CMS fields/page code.

## Trial registration

The Registration record in `AristaPageContent` supplies visibility, intro, heading,
description, optional caption and optional submit label (`primaryButtonText`).
`AristaSiteSettings` supplies address/phone/hours labels and values, plus
`locationImage`, `locationImageDescription` and `locationImageFocusHeight`.
Visible Programs supply the form choices. No new CMS collection, fields or dataset is needed.

Create a **backend web module** named `trial-registration.web.js` in the Wix code
panel and copy `src/wix/backend/trial-registration.web.js` into it. Replace the dev
page code with `src/wix/arista-preview.page.js`, then rebuild/deploy the component.
Keep the native Wix Form in Forms & Submissions; it does not need to be placed on
the canvas. Its layout and confirmation settings do not style this custom UI.

The backend targets form `1a3ca13f-0752-41c7-94ab-776889eec506` with keys
`full_name`, `phone`, `student_type`, `program`, `message`. Verify these are the
form field keys, not just labels. Name and phone are required; choices/message
are optional. Dropdown values must exactly match the Wix form. If program names
change, update the CMS, Wix form options and backend PROGRAMS allowlist together.
The backend accepts only those fields, normalizes Vietnamese phone numbers to
+84, and never trusts a client-supplied form ID, status or submission options.

The component emits `arista-registration-submit`; page code calls the backend
and returns a correlated `registration-result` attribute without rerendering the
page. Pending controls prevent repeated clicks. Errors preserve typed values;
success resets the form and displays a confirmation. There is no automatic retry
when the outcome is uncertain. Backend errors do not log names or phone numbers.

Local `index.html` simulates success and explicitly says no information was sent.
`npm run check` verifies the adapter/bridge contract and backend validation,
normalization, fixed destination, duplicate cooldown and failure behavior using
mocked Wix methods. It does not send a real submission.

Before accepting live registrations, submit a clearly marked test on the Wix
test site and verify the row in **Forms & Submissions > View submissions**, including
phone and both dropdown values. Verify notification recipients/automation with
that same test; API success alone does not prove an email was delivered.
The basic hidden honeypot and per-phone server-instance cooldown are not CAPTCHA
or a distributed rate limiter. A public custom endpoint needs stronger spam
protection if abuse occurs; native Wix Form anti-spam behavior must not be assumed
to apply to this elevated API call.
