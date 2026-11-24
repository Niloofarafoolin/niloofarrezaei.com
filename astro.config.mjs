// @ts-check
import { defineConfig } from 'astro/config';

// `site` is the public address. Pages use it for their full address in metadata and in the sitemap.
// The site is published by .github/workflows/deploy.yml each time the main branch changes.
export default defineConfig({
  site: 'https://niloofarrezaei.com',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
});
