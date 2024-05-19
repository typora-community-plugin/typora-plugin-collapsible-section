import * as child_process from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as esbuild from 'esbuild'
import typoraPlugin from 'esbuild-plugin-typora'
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

  const manifestPath = './src/manifest.json'
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'))

  await fs.copyFile(manifestPath, './dist/manifest.json')
  await fs.rename('./dist/main.css', './dist/style.css')
  await fs.rename('./dist/main.css.map', './dist/style.css.map')
  await fs.cp('./dist', './test/vault/.typora/plugins/dist', { recursive: true })
  await fs.writeFile('./test/vault/.typora/plugins.json', JSON.stringify({ [manifest.id]: true }))

  await fs.rm(path.join(process.env.USERPROFILE, '.typora/community-plugins/.lock/win-test'))
    .catch(() => { })

  child_process.exec('Typora ./test/vault/doc.md')
}
