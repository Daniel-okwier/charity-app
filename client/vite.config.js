import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [

        {
        find: '@lib',
        replacement: path.resolve(__dirname, 'src/lib')
      },
      {
        find: /^@\/(.*)/,
        replacement: path.resolve(__dirname, 'src/$1')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components')
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, 'src/pages')
      },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, 'src/assets')
      },
      {
        find: '@contexts',
        replacement: path.resolve(__dirname, 'src/contexts')
      },
      {
        find: '@services',
        replacement: path.resolve(__dirname, 'src/services')
      },
      {
        find: '@hooks',
        replacement: path.resolve(__dirname, 'src/hooks')
      }
    ]
  }
});