import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { apiPlugin } from './server/api.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), apiPlugin()],
  server: {
    port: 5174,
    host: true
  }
});
