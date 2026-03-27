import fs from 'node:fs'

export function importRawQueries(rawPath) {
  return JSON.parse(fs.readFileSync(rawPath, 'utf8'))
}

