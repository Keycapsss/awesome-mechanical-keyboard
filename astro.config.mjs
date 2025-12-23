import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), sitemap()],
  site: `https://keebfolio.netlify.app`,
  trailingSlash: 'never',
  prefetch: true,
});
