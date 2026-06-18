import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Cho phép mọi đường link (như ngrok) truy cập vào local server
    allowedHosts: true
  }
});
