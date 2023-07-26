import * as fs from 'node:fs'
import archiver from 'archiver'


const output = fs.createWriteStream('plugin.zip')

const archive = archiver('zip', { zlib: { level: 9 } })
  .on('error', (err) => { throw err })

archive.pipe(output)

archive
  .directory('dist', false)
  .file('src/manifest.json', { name: 'manifest.json' })

archive.finalize()
