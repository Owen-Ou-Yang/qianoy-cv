import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
assert(htmlFiles.length >= 8, 'Build must include all requested routes and the 404 page.');
const titles = new Set();
const htmlByPath = new Map();
const routeOf = file => '/' + path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, '');
const readAttr = (tag, name) => tag.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
const required = ['index.html', 'research/index.html', 'projects/index.html', 'publications/index.html', 'cv/index.html', 'about/index.html', 'contact/index.html', '404.html', 'cv.pdf', 'favicon.svg', 'robots.txt', 'sitemap.xml', '_headers'];
for (const file of required) assert(files.includes(path.join(root, file)), `Missing ${file}`);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const route = routeOf(file);
  htmlByPath.set(file, html);
  assert.match(html, /<html[^>]+lang="en"/, `${route}: document language`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route}: exactly one h1`);
  assert.match(html, /<main[^>]+id="main"/, `${route}: main landmark`);
  assert.match(html, /href="#main"/, `${route}: skip link`);
  assert.match(html, /name="viewport"/, `${route}: viewport`);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title && !titles.has(title), `${route}: unique nonempty title`);
  titles.add(title);
  for (const field of ['description', 'og:title', 'og:description', 'og:url', 'twitter:title']) {
    const tag = (html.match(/<meta\b[^>]*>/g) ?? []).find(tag => readAttr(tag, 'name') === field || readAttr(tag, 'property') === field);
    assert(tag && readAttr(tag, 'content'), `${route}: ${field}`);
  }
  const canonicalTag = (html.match(/<link\b[^>]*>/g) ?? []).find(tag => readAttr(tag, 'rel') === 'canonical');
  assert.equal(readAttr(canonicalTag ?? '', 'href'), `https://cv.qianoy.uk${route}`, `${route}: canonical URL`);
  const headings = [...html.matchAll(/<h([1-6])(?:\s|>)/g)].map(match => Number(match[1]));
  for (let i = 1; i < headings.length; i++) assert(headings[i] <= headings[i - 1] + 1, `${route}: skipped heading level`);
  for (const script of html.match(/<script\b[^>]*>/g) ?? []) assert.equal(readAttr(script, 'type'), 'application/ld+json', `${route}: unexpected client JavaScript`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    assert(readAttr(img, 'alt')?.trim(), `${route}: image needs descriptive alt text`);
    assert(Number(readAttr(img, 'width')) > 0 && Number(readAttr(img, 'height')) > 0, `${route}: image dimensions prevent layout shifts`);
  }
  const ogImage = (html.match(/<meta\b[^>]*>/g) ?? []).find(tag => readAttr(tag, 'property') === 'og:image');
  if (ogImage) {
    const imageUrl = new URL(readAttr(ogImage, 'content'));
    if (imageUrl.origin === 'https://cv.qianoy.uk') assert(files.includes(path.join(root, imageUrl.pathname)), `${route}: social image is missing`);
  }
  assert(Buffer.byteLength(html) < 100 * 1024, `${route}: HTML exceeds 100 KiB budget`);
}

let checkedLinks = 0;
for (const [file, html] of htmlByPath) {
  for (const tag of html.match(/<(?:a|link|img)\b[^>]*>/g) ?? []) {
    const href = readAttr(tag, tag.startsWith('<img') ? 'src' : 'href');
    if (!href) continue;
    assert(!/^(?:javascript|data):/i.test(href), `Unsafe URL in ${file}`);
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(href.replaceAll('&amp;', '&'), `https://cv.qianoy.uk${routeOf(file)}`);
    let target = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
    assert(files.includes(target), `${routeOf(file)}: broken local link ${href}`);
    if (url.hash) {
      const destination = htmlByPath.get(target) ?? await readFile(target, 'utf8');
      assert(destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${routeOf(file)}: broken anchor ${href}`);
    }
    checkedLinks++;
  }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const projectRecords = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
for (const project of projectRecords.filter(project => project.published !== true)) {
  const route = `/projects/${project.slug}/`;
  assert(!files.includes(path.join(root, route, 'index.html')), `Unpublished project emitted: ${route}`);
  assert(!sitemap.includes(route), `Unpublished project in sitemap: ${route}`);
  for (const [file, html] of htmlByPath) {
    assert(!html.includes(`href="${route}"`), `${routeOf(file)} links to an unpublished project`);
  }
}
assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
for (const [file, html] of htmlByPath) {
  const loc = `<loc>https://cv.qianoy.uk${routeOf(file)}</loc>`;
  if (html.includes('content="noindex, follow"')) assert(!sitemap.includes(loc), `Noindex route in sitemap: ${routeOf(file)}`);
  else assert(sitemap.includes(loc), `Indexable route missing from sitemap: ${routeOf(file)}`);
}
assert.match(await readFile(path.join(root, 'robots.txt'), 'utf8'), /Sitemap: https:\/\/cv\.qianoy\.uk\/sitemap\.xml/);
assert.equal((await readFile(path.join(root, 'cv.pdf'))).subarray(0, 5).toString(), '%PDF-', 'CV must be a real PDF');
const cssFiles = files.filter(file => file.endsWith('.css'));
let cssBytes = 0;
for (const file of cssFiles) cssBytes += (await stat(file)).size;
assert(cssBytes < 30 * 1024, 'CSS exceeds 30 KiB budget');
const scripts = files.filter(file => /\.(?:m?js)$/.test(file));
assert.equal(scripts.length, 0, 'Static output should contain no executable JavaScript bundles');
console.log(`PASS: ${htmlFiles.length} HTML pages, ${checkedLinks} internal links/assets, metadata, headings, sitemap, robots, PDF, and static-output budgets.`);
console.log(`CSS: ${cssBytes.toLocaleString()} bytes; executable browser JavaScript: 0 bytes.`);
