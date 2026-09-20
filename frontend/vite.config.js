import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // sockjs-client expects Node's `global` object, which doesn't exist
    // in the browser. Vite (unlike webpack/CRA) doesn't polyfill this
    // automatically, so we alias it to `window`.
    global: 'window',
  },
})