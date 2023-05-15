/*
 * @Author: Royal
 * @LastEditTime: 2022-04-26 11:12:32
 * @Description: 
 * @FilePath: /myindex/vitelib.config.ts
 */
//vite --config my-config.js
import { defineConfig } from 'vite';
import path from 'path';
import dts from "vite-plugin-dts"
// import { visualizer } from 'rollup-plugin-visualizer';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ dts()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, 'src')
      },
    ]
  },
  build: {
    // target:
    target: ["es2019"],
    outDir: "./dist",
    lib: {
      formats: ["es","umd"],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'web-fs',
      fileName: (format) => {
        return format === 'es' ? 'webfs.mjs' : 'webfs.umd.js'
      }
    },
    rollupOptions: {
      plugins: [
      ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
      }
      //   inlineDynamicImports: true//blog
    }
  }
})
