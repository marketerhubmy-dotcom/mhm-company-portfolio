/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  build: { target: 'es2022', reportCompressedSize: true },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
