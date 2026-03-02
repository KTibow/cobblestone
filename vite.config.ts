import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { monoserve } from 'monoserve/plugin';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import { resolve } from 'node:path';

const inject = {
  MONOIDENTITY_APP_ID: [resolve('./monoidentity-config.ts'), 'MONOIDENTITY_APP_ID'],
  MONOIDENTITY_SYNC_FOR: [resolve('./monoidentity-config.ts'), 'MONOIDENTITY_SYNC_FOR'],
} satisfies Record<string, [string, string]>;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    functionsMixins({ deps: ['m3-svelte'] }),
    monoserve({ monoserverURL: 'https://benignmonoserver.fly.dev' }),
  ],
  build: {
    rolldownOptions: {
      transform: { inject },
    },
  },
  optimizeDeps: {
    rolldownOptions: {
      transform: { inject },
    },
  },
});
