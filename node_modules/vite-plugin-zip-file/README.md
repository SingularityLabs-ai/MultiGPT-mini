# vite-plugin-zip-file
[![MIT LICENSE](https://img.shields.io/badge/LICENSE-MIT-green)](./LICENSE)
 ![size](https://img.shields.io/bundlephobia/min/vite-plugin-zip-file)
[![downloads](https://img.shields.io/npm/dw/vite-plugin-zip-file)](https://www.npmjs.com/package/vite-plugin-zip-file)

Zip files at build time.

# Install

```
yarn add vite-plugin-zip-file --dev
```

or

```
npm install vite-plugin-zip-file --save-dev
```

# Optons


| Param      | Types        | Rquired | Default | Desc                                                         |
| :--------- | ------------ | ------- | ------- | ------------------------------------------------------------ |
| folderPath | String\|Path | true    | -       | Path to the compressed folder                                |
| outPath    | String\|Path | true    | -       | Compressed package output path                               |
| zipName    | String       | false   | dist    | Package name                                                 |
| enabled  | Boolean      | false   | true    | This parameter is used to control whether the plugin is enabled. It is usually used to determine whether to compress files according to the environment |




# Usage
```javascript
import { defineConfig } from 'vite';
import { viteZip } from 'vite-plugin-zip-file';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from 'node:process';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteZip({
      folderPath: path.resolve(__dirname, 'dist'),
      outPath: path.resolve(__dirname),
      zipName: 'Test.zip',
      enabled: env.NODE_ENV === 'production'? true: false
    })
  ]
})
```