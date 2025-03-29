import { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export function copyToDistPlugin(): Plugin {
  return {
    name: 'copy-to-dist',
    generateBundle() {
      // Copy popup.html
      const popupHtml = fs.readFileSync(path.resolve(__dirname, '../src/popup.html'), 'utf-8');
      this.emitFile({
        type: 'asset',
        fileName: 'popup.html',
        source: popupHtml,
      });
    },
  };
} 