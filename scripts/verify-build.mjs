import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { verifyCvAsset } from './verify-cv-asset.mjs';

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
const researchLines = JSON.parse(await readFile('src/data/research-lines.json', 'utf8'));
const publishedSlugs = projectRecords.filter(project => project.published === true).map(project => project.slug);
const groupedSlugs = researchLines.flatMap(line => line.stages.map(stage => stage.slug));
assert.equal(new Set(researchLines.map(line => line.id)).size, researchLines.length, 'Research line IDs must be unique.');
assert.equal(new Set(groupedSlugs).size, groupedSlugs.length, 'Each project must belong to one research line.');
assert.deepEqual([...groupedSlugs].sort(), [...publishedSlugs].sort(), 'Research lines must include every published project and no unpublished project.');
const cvHtml = htmlByPath.get(path.join(root, 'cv/index.html'));
const homeHtml = htmlByPath.get(path.join(root, 'index.html'));
const profile = JSON.parse(await readFile('src/data/profile.json', 'utf8'));
const exchange = profile.exchangeEducation;
if (exchange) {
  for (const text of ['Academic background', 'Semester GPA', `${exchange.credits} credits`, 'Graduate-level Computer Vision (A)', 'Coursework and academic record']) {
    assert(!homeHtml.includes(text), `Homepage must keep academic-record details on the CV: ${text}`);
  }
  for (const route of ['about/index.html']) {
    const html = htmlByPath.get(path.join(root, route));
    const block = html.match(/<article\b[^>]*id="notre-dame-exchange"[^>]*>([\s\S]*?)<\/article>/)?.[1];
    const exchangeLabel = exchange.role === 'Non-degree Exchange Student' && exchange.level === 'Undergraduate exchange'
      ? 'Undergraduate Exchange Student (non-degree)' : exchange.role;
    assert(block?.includes(exchangeLabel), `${route}: accurate combined exchange identity`);
    assert.equal(block.split(exchange.dates).length - 1, 1, `${route}: one adjacent exchange date`);
    assert(block.includes(`Semester GPA: ${exchange.semesterGpa}`) && block.includes(`${exchange.credits} credits`), `${route}: semester GPA and credits must stay in the exchange record`);
    for (const course of exchange.courses) {
      const row = (block.match(/<tr>[^]*?<\/tr>/g) ?? []).find(row => row.includes(course.code));
      assert(row?.includes(course.name) && row.includes(course.level) && row.includes(course.grade), `${route}: course name, code, level, and grade must agree with the shared record`);
    }
    const assistant = html.match(/<article\b[^>]*class="experience-entry"[^>]*>[^]*?Research Assistant[^]*?<\/article>/)?.[0] ?? '';
    assert(!assistant.includes(exchange.semesterGpa), `${route}: exchange GPA must not become a research-assistant credential`);
  }
}
const coursework = JSON.parse(await readFile('src/data/coursework.json', 'utf8')).filter(project => project.published);
for (const project of coursework) {
  for (const route of ['about/index.html']) {
    const html = htmlByPath.get(path.join(root, route));
    assert(html.includes(project.title) && html.includes(project.instructor), `${route}: approved course project missing`);
    if (project.repository) assert(html.includes(`href="${project.repository}"`), `${route}: public course-project code link`);
  }
}
const curatedCv = JSON.parse(await readFile('src/data/cv.json', 'utf8'));
const cvAsset = await verifyCvAsset({ builtPath: path.join(root, 'cv.pdf') });
const cvMain = cvHtml.match(/<main\b[^>]*>([^]*?)<\/main>/)?.[1] ?? '';
const textOf = html => html.replace(/<[^>]*>/g, ' ').replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replace(/\s+/g, ' ').trim();
const cvText = textOf(cvMain);
const cvSections = [...cvMain.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(match => match[1]);
assert.deepEqual(cvSections, ['Education', 'Research Experience', 'Industry Experience', 'Technical Skills'], 'CV must follow the approved Application selection.');
const selectionIds = [...curatedCv.education, ...curatedCv.researchExperience, ...curatedCv.industryExperience].map(entry => entry.id);
assert.equal(new Set(selectionIds).size, selectionIds.length, 'Application CV IDs must be unique.');
for (const entry of curatedCv.education) {
  const block = cvMain.match(new RegExp(`<article\\b[^>]*id="${entry.id}"[^>]*>([^]*?)<\\/article>`))?.[1];
  assert(block, `Selected CV education missing: ${entry.id}`);
  const text = textOf(block);
  if (entry.source === 'education') {
    for (const fact of [profile.education.institution, profile.education.dates, `${profile.education.degree} in ${profile.education.background}`, profile.education.college, profile.education.program]) {
      assert(text.includes(fact), `CV degree fact missing: ${fact}`);
      assert(textOf(htmlByPath.get(path.join(root, 'about/index.html'))).includes(fact), `About degree fact missing: ${fact}`);
    }
  }
  if (entry.source === 'exchangeEducation') {
    assert(text.includes('Undergraduate Exchange Student (non-degree)'), 'CV exchange is undergraduate/non-degree.');
    assert(text.includes(exchange.dates) && text.includes(exchange.semesterGpa) && text.includes(`${exchange.credits} credits`), 'CV retains exchange dates, semester GPA, and credits.');
    for (const code of entry.courseCodes ?? []) {
      const course = exchange.courses.find(course => course.code === code);
      const label = `${course?.name} (${course?.level === 'Graduate level' ? 'graduate, ' : ''}${course?.grade})`;
      assert(course && text.includes(label), `Selected CV course name, level, or grade mismatch: ${code}`);
    }
  }
}
for (const entry of curatedCv.researchExperience) {
  const record = profile.experience.find(record => record.role === entry.profileRole);
  assert(record, `Unknown selected CV role: ${entry.profileRole}`);
  const block = cvMain.match(new RegExp(`<article\\b[^>]*id="${entry.id}"[^>]*>([^]*?)<\\/article>`))?.[1];
  const text = textOf(block ?? '');
  for (const fact of [record.role, record.institution, record.dates, record.advisor, record.department]) assert(text.includes(fact), `CV research fact mismatch: ${fact}`);
  assert(!text.includes(exchange.semesterGpa), 'Exchange GPA is not a research credential.');
  if (entry.relatedRole) {
    const related = profile.experience.find(record => record.role === entry.relatedRole);
    assert(related && text.includes(related.role) && text.includes(related.term), 'CV retains the approved iSURE identity and term.');
  }
  let position = -1;
  for (const topic of entry.topics) {
    const next = block.indexOf(topic.title);
    assert(next > position, `CV topic missing or reordered: ${topic.id}`);
    const topicBlock = block.match(new RegExp(`<section\\b[^>]*id="${topic.id}"[^>]*>([^]*?)<\\/section>`))?.[1];
    assert(topicBlock, `CV research topic missing: ${topic.id}`);
    assert(Array.isArray(topic.paragraphs) && topic.paragraphs.length > 0, `CV topic needs explicit paragraphs: ${topic.id}`);
    const paragraphs = [...topicBlock.matchAll(/<p>([^]*?)<\/p>/g)].map(match => textOf(match[1]));
    assert.deepEqual(paragraphs, topic.paragraphs, `CV paragraphs must match approved Application wording and order: ${topic.id}`);
    assert(!/<(?:ul|ol|li)\b/.test(topicBlock), `HTML CV retains natural paragraphs: ${topic.id}`);
    position = next;
  }
}
for (const entry of curatedCv.industryExperience) {
  const record = profile.industryExperience.find(record => record.role === entry.profileRole);
  assert(record, `Unknown selected industry role: ${entry.profileRole}`);
  const block = cvMain.match(new RegExp(`<article\\b[^>]*id="${entry.id}"[^>]*>([^]*?)<\\/article>`))?.[1];
  const text = textOf(block ?? '');
  for (const fact of [record.role, record.institution, record.dates, record.department, record.location]) assert(text.includes(fact), `CV internship fact mismatch: ${fact}`);
  assert.deepEqual([...block.matchAll(/<p>([^]*?)<\/p>/g)].map(match => textOf(match[1])), entry.paragraphs, 'CV internship paragraphs match the approved wording.');
}
assert.deepEqual(curatedCv.skills.map(skill => ({ title: skill.label, description: skill.items.join(', ') })), profile.skills, 'CV and About skills must use the same approved tools.');
for (const skill of curatedCv.skills) {
  assert(cvText.includes(skill.label) && cvText.includes(skill.items.join(', ')), 'CV skills must match the approved categories and tools.');
}
for (const omitted of ['Driving Coach', 'Course Project', 'Atom-JEPA', 'QM9', 'Bouc', 'state-space', 'crystal', 'Scientific Computing / Research Workflows', 'CURRICULUM VITAE', 'Closed ', 'Displayed pilot']) {
  assert(!cvText.includes(omitted), `Content outside the Application selection leaked into CV: ${omitted}`);
}
assert.deepEqual(files.filter(file => file.toLowerCase().endsWith('.pdf')).map(file => path.relative(root, file)), ['cv.pdf'], 'Only the approved Application PDF belongs in deployed output.');
const downloadHref = `${cvAsset.publicPath}?v=${cvAsset.sha256.slice(0, 12)}`;
let downloadLinks = 0;
for (const [file, html] of htmlByPath) {
  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    const href = readAttr(tag, 'href');
    if (!href || !/\.pdf(?:[?#]|$)/i.test(href)) continue;
    assert.equal(href, downloadHref, `${routeOf(file)}: all PDF links must use the versioned approved Application download`);
    downloadLinks++;
  }
}
assert(downloadLinks >= 2, 'Home and CV must both offer the approved PDF.');
const cvTopics = curatedCv.researchExperience.flatMap(entry => entry.topics);
assert.deepEqual(researchLines.map(line => line.title), cvTopics.map(topic => topic.title), 'Website research headings and order must follow the approved CV topics.');
assert.deepEqual(researchLines.flatMap(line => line.stages.filter(stage => stage.featured).map(stage => stage.slug)), cvTopics.flatMap(topic => topic.sourceProjects), 'Website highlights must follow the studies selected in the approved CV.');
for (const line of researchLines) {
  for (const stage of line.stages) {
    assert.equal(typeof stage.featured, 'boolean', `${stage.slug}: explicit website emphasis is required`);
    assert.equal(homeHtml.includes(`href="/projects/${stage.slug}/"`), stage.featured, `${stage.slug}: homepage links must match the selected research, independently of project status`);
  }
}
for (const route of ['research/index.html', 'projects/index.html']) {
  const html = htmlByPath.get(path.join(root, route));
  for (let index = 0; index < researchLines.length; index++) {
    const line = researchLines[index];
    const start = html.indexOf(`id="${line.id}"`);
    const end = index + 1 < researchLines.length ? html.indexOf(`id="${researchLines[index + 1].id}"`) : html.length;
    assert(start >= 0 && end > start, `${route}: missing or reordered research line ${line.id}`);
    const group = html.slice(start, end);
    for (const stage of line.stages) assert(group.includes(`href="/projects/${stage.slug}/"`), `${route}: missing project in its research line`);
  }
}
for (const line of researchLines) {
  for (const stage of line.stages) {
    const html = htmlByPath.get(path.join(root, 'projects', stage.slug, 'index.html'));
    assert(html.includes(`href="/research/#${line.id}"`), `${stage.slug}: missing backlink to its research line`);
    const related = html.split('id="related-studies-heading"')[1]?.split('</section>')[0] ?? '';
    for (const other of publishedSlugs.filter(slug => slug !== stage.slug)) {
      assert.equal(related.includes(`href="/projects/${other}/"`), line.stages.some(member => member.slug === other), `${stage.slug}: related work must stay within its research line`);
    }
  }
}
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
