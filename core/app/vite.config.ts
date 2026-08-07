import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { getLocalIPv4 } from '@isolde/utils';

const isHostMode = process.argv.includes('--host') || process.argv.includes('-h');

const localIp = isHostMode
  ? process.env.TAURI_DEV_HOST || getLocalIPv4()
  : 'localhost';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    host: isHostMode,
    hmr: {
      protocol: 'ws',
      host: localIp,
      port: 5173,
    },
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows'
        ? 'chrome105'
        : 'safari13',
    minify: !process.env.TAURI_ENV_DEBUG ? true : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
