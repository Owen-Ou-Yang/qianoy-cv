import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

// Validate the approved bytes before Astro can copy public/ into dist/.
// The supplied Application layout is authoritative; builds never re-typeset it.
export async function verifyCvAsset({ builtPath } = {}) {
  const { document } = JSON.parse(await readFile(path.join(root, 'src/data/cv.json'), 'utf8'));
  assert.equal(document?.kind, 'owner-approved-pdf', 'CV must select an owner-approved PDF.');
  assert.equal(document.publicPath, '/cv.pdf', 'The public Application CV must use /cv.pdf.');
  assert.equal(document.pageCount, 1, 'The approved Application CV must remain one page.');
  assert.match(document.sha256 ?? '', /^[a-f0-9]{64}$/, 'Approved CV needs an explicit SHA-256.');
  assert.equal(typeof document.source, 'string', 'Approved CV source is required.');
  const source = path.resolve(root, document.source);
  const sourceDir = path.join(root, 'assets/cv') + path.sep;
  assert(source.startsWith(sourceDir), 'Approved CV source must be inside assets/cv/.');
  const original = await readFile(source);
  assert.equal(original.subarray(0, 5).toString(), '%PDF-', 'Approved source must be a PDF.');
  assert.equal(sha256(original), document.sha256, 'Approved CV source hash changed; confirm the new PDF explicitly.');
  const published = await readFile(path.join(root, 'public/cv.pdf'));
  assert.equal(sha256(published), document.sha256, 'public/cv.pdf differs from the approved Application PDF. Restore it with python3 scripts/generate-cv.py.');
  if (builtPath) {
    assert.equal(sha256(await readFile(builtPath)), document.sha256, 'Built CV differs from the approved Application PDF.');
  }
  return { source: document.source, publicPath: document.publicPath, sha256: document.sha256, pageCount: document.pageCount, bytes: original.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const document = await verifyCvAsset();
    console.log(`Approved Application PDF verified (${document.bytes} bytes; SHA-256 ${document.sha256}).`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
