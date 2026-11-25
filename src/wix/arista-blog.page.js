// Paste in Blog page code. Custom Element: aristaBlog, tag: arista-blog.
// Existing Wix Blog feed ID: blog1; do not delete it.
import { startBlog } from 'public/arista-blog-page.js';
import { submitTrialRegistration } from 'backend/trial-registration.web';

$w.onReady(() => startBlog($w, { submitTrialRegistration }));
