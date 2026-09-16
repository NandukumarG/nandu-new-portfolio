import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Keep the optional globe engine out of the initial page bundle and
        // cache its core and renderer separately.
        codeSplitting: {
          groups: [{ name: 'earth-engine', test: /node_modules[\\/]three[\\/]/, maxSize: 400_000 }],
        },
      },
    },
  },
})
