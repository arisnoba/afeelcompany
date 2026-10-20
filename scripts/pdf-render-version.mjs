import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Compute at build/startup, so runtime functions do not need deployed source
// files. Data-only edits are detected separately by the brochure content hash.
const INPUTS = [
  'src/app/pdf-export', 'src/app/api/pdf', 'src/app/layout.tsx', 'src/app/globals.css',
  'src/i18n', 'src/lib/company-copy.ts', 'src/lib/site-address.ts', 'src/types/pdf.ts',
  'public/images', 'public/pdf-fixtures', 'package-lock.json',
]

/** @param {string} root */
export function getPdfRenderVersion(root) {
  const hash = createHash('sha256')
  function visit(relative) {
    const pathname = join(root, relative)
    if (statSync(pathname).isDirectory()) {
      readdirSync(pathname).filter(name => !name.startsWith('.')).sort().forEach(name => visit(`${relative}/${name}`))
    } else {
      hash.update(relative).update('\0').update(readFileSync(pathname)).update('\0')
    }
  }
  INPUTS.forEach(visit)
  return hash.digest('hex')
}
