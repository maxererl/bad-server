import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],

  resolve: {
    alias: {
      $fonts: resolve(__dirname, 'src/vendor/fonts'),
      $assets: resolve(__dirname, 'src/assets'),
    },

    tsconfigPaths: true,
  },

  build: {
    assetsInlineLimit: 0,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/scss/variables" as *;
          @use "/src/scss/mixins" as mixins;
        `,
      }
    },
  },
});