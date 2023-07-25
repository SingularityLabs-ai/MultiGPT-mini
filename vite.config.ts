import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.config'
import { viteZip } from 'vite-plugin-zip-file';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), crx({ manifest }),
    viteZip({
      folderPath: '/Users/ishandutta2007/Documents/Projects/GrandGPT/dist',
      outPath: '/Users/ishandutta2007/Documents/Projects/GrandGPT/zips',
      // outPath: path.resolve(__dirname),
      zipName: 'chromium.zip',
      // enabled: env.NODE_ENV === 'production'? true: false
    })
  ],
  build: {
    rollupOptions: {
      input: ['app.html', 'sidepanel.html'],
    },
  },
})