import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://kairosvicentino.org',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
