// Paste in Post page code. Custom Element: aristaBlog, tag: arista-blog.
// Existing Wix Post component ID: post1; keep its URL/SEO routing.
import { startBlog } from 'public/arista-blog-page.js';
import { submitTrialRegistration } from 'backend/trial-registration.web';

$w.onReady(() => startBlog($w, { postPage: true, submitTrialRegistration }));
