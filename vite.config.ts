import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to copy files to dist
function copyAssetsPlugin() {
  return {
    name: 'copy-assets',
    generateBundle() {
      // Copy popup.html
      const popupHtml = fs.readFileSync(resolve(__dirname, 'src/popup.html'), 'utf-8');
      this.emitFile({
        type: 'asset',
        fileName: 'popup.html',
        source: popupHtml,
      });

      // Copy manifest and icons
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(require('./src/manifest.json'), null, 2),
      });

      // Copy all icon files
      const iconFiles = fs.readdirSync('./src/icons');
      for (const file of iconFiles) {
        if (file.endsWith('.png') || file.endsWith('.svg')) {
          this.emitFile({
            type: 'asset',
            fileName: `icons/${file}`,
            source: fs.readFileSync(`./src/icons/${file}`),
          });
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [vue(), copyAssetsPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.ts'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'popup.css';
          }
          return '[name].[ext]';
        }
      }
    }
  },
  publicDir: 'public',
}); 