import * as child_process from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as esbuild from 'esbuild'
import typoraPlugin, { installDevPlugin, closeTypora } from 'esbuild-plugin-typora'
import { sassPlugin } from 'esbuild-sass-plugin'


const args = process.argv.slice(2)
const IS_PROD = args.includes('--prod')
const IS_DEV = !IS_PROD

await fs.rm('./dist', { recursive: true, force: true })

await esbuild.build({
  entryPoints: ['src/main.ts'],
  outdir: 'dist',
  format: 'esm',
  bundle: true,
  minify: IS_PROD,
  sourcemap: IS_DEV,
  plugins: [
    typoraPlugin({
      mode: IS_PROD ? 'production' : 'development'
    }),
    sassPlugin(),
  ],
})

if (IS_DEV) {

  await installDevPlugin()
  await closeTypora()
  child_process.exec('Typora ./test/vault/doc.md')
}
