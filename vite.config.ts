import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.app.json' }), preserveDirectives()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, './lib/'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'react-smooth-flow',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
