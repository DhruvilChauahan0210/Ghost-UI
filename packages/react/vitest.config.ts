import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({
  resolve: {
    alias: {
      '@ghost-ui/react': path.resolve(__dirname, 'src/index.ts'),
      '@ghost-ui/testing/react': path.resolve(__dirname, '../testing/src/react.tsx'),
      '@ghost-ui/testing': path.resolve(__dirname, '../testing/src/index.ts'),
      '@ghost-ui/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/test-setup.ts'],
  },
});
