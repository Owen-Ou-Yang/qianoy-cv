# cv.qianoy.uk - Academic website

A complete, static Astro website for an academic profile in AI for materials and molecular simulation. It uses semantic HTML, system fonts, a shared CSS design system, and reusable Astro components. No frontend framework, external font requests, analytics, database, or client JavaScript is required.

The profile includes Qian Ouyang's confirmed contact details, Artificial Intelligence major and Experimental Class at Xi'an Jiaotong University (2023-2027, expected), RA role with Prof. Tengfei Luo at Notre Dame (October 2025-present), visiting-student and iSURE dates, and C++/Python skills. Project entries are temporarily withheld from the website and PDF at the owner's request; research interests remain visible. No B.Eng./B.Sc. degree type, publication, or quantitative research result is assumed. See [TODO.md](TODO.md) and [CONTENT_NOTES.md](CONTENT_NOTES.md).

## Develop locally

Use Node 22.16.0 (pinned in `.nvmrc`) or a compatible supported even-numbered Node version >=22.12.0. npm is the package manager; commit `package-lock.json`.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open the localhost URL printed by Astro (normally http://127.0.0.1:4321). `nvm` is optional if Node is already installed. With current Astro, a noninteractive invocation may start a background server; `npx astro dev status`, `npx astro dev logs`, and `npx astro dev stop` manage it. In restricted environments, prefix commands with `ASTRO_TELEMETRY_DISABLED=1` to avoid writing Astro's user-level telemetry configuration.

```sh
npm run lint       # Astro, HTML-template, and TypeScript diagnostics
npm run build      # Complete static site in dist/
npm test           # Check the generated output (build first)
npm run validate   # All three, in order
npm run preview    # Serve the production build locally
```

`lint` intentionally uses Astro's own diagnostics instead of adding a separate ESLint toolchain. Validation checks every generated page and local link, heading order, unique titles, SEO and OpenGraph metadata, canonical URLs, sitemap/noindex consistency, a real PDF download, and lightweight output budgets. It is not a browser accessibility audit or a measured Core Web Vitals report. Responsive styles cover narrow screens and wrapping navigation; manually review on mobile and at 200% zoom before the public launch.

## Structure

```text
.
├── .github/workflows/ci.yml        # Validation on main and pull requests
├── .gitattributes
├── .gitignore
├── .nvmrc
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
├── TODO.md
├── DEPLOYMENT.md
├── CONTENT_NOTES.md                # Content provenance and claim boundaries
├── public/
│   ├── _headers                   # Cloudflare caching and security headers
│   ├── favicon.svg
│   └── cv.pdf                     # Generated academic CV from confirmed profile
├── scripts/
│   ├── generate-cv.py              # Optional PDF generator from shared JSON
│   └── verify-build.mjs
└── src/
    ├── components/
    │   ├── Education.astro
    │   ├── Experience.astro
    │   ├── Skills.astro
    │   ├── PageHeader.astro
    │   ├── ProfileLinks.astro
    │   ├── ProjectEntry.astro
    │   └── Todo.astro
    ├── data/
    │   ├── profile.json           # Name, biography, experience, education, skills
    │   ├── research.json          # Research themes and descriptions
    │   ├── projects.json          # Project and software-output records
    │   ├── publications.json      # Actual citations only; currently empty
    │   ├── site.ts                # Profile types, exports, navigation
    │   ├── projects.ts            # Project types and exports
    │   └── outputs.ts             # Citation types and software-output selection
    ├── layouts/BaseLayout.astro   # Navigation, metadata, footer
    ├── styles/global.css          # Theme, layouts, responsive and print styles
    └── pages/
        ├── index.astro
        ├── research.astro
        ├── projects/index.astro
        ├── projects/[slug].astro
        ├── publications.astro
        ├── cv.astro
        ├── about.astro
        ├── contact.astro
        ├── 404.astro
        ├── robots.txt.ts
        └── sitemap.xml.ts
```

## Edit content

### Profile, research, and links

Edit `src/data/profile.json` for identity, biography, education, academic experience, skills, and contact links. Replace `null` with verified values. Absent optional links render as TODO text rather than dead links. `name` supplies page titles and Person structured metadata. Edit `src/data/research.json` for research themes, descriptions, and keywords. `src/data/site.ts` holds the types and navigation.

Use a plain email address for `email` (the site adds `mailto:`), full HTTPS URLs for `github` and `linkedin`, and skill objects with `title` and `description`. Add verified languages to `programmingLanguages`; do not infer them from a project topic. A public email is visible to everyone. No contact form or data collection is included.

### Projects and optional figures

Edit `src/data/projects.json`. Each published record generates `/projects/<slug>/` automatically. `src/data/projects.ts` defines the field types:

- `slug`, `title`, `theme`, `summary`: identity and overview.
- `question`, `methodology`, `results`: a question string and lists of concrete methods/results.
- `resultsNote`: current limits or an explicit statement that there are no results yet.
- `detailsTodo`: remaining information needed for the project record.
- `role` and `status`: personal contribution and actual project status; `repository`: a public HTTPS code URL or `null`.
- `published`: set to `true` only when the owner wants the record publicly displayed. Only published records generate detail pages or appear in the website/PDF. The public project array is currently empty.
- `selected`: show a published entry on the homepage.
- `isPlaceholder`: use `true` for a topic-only draft, which is excluded from indexing/sitemap. An actual ongoing project may use `false` without claiming completion.
- `output`: optional `{ "type": "Research software", "role": "..." }` (or `Research workflow`). This includes the project in research output and the HTML CV without creating a publication citation.
- `figure`: optional `{ "src": "/figures/filename.webp", "alt": "...", "caption": "..." }`. Add an optimized, publishable image to `public/figures/` with descriptive alt text and provenance.

Project drafts are retained only in the owner's local ignored files and local history. The public `projects.json` is empty. The Projects navigation item and homepage section disappear when no records are published; the empty `/projects/` route uses `noindex`, and detail routes are not built. General research interests and tool experience remain visible.

When adding new records, note that `published: false` controls rendered output only. Confidential drafts must stay outside public source and public Git history.

### Publications and other citations

`src/data/publications.json` is intentionally empty. Allowed `type` values: `Publication`, `Preprint`, `Manuscript`, `Poster`, and `Talk`. Each entry needs `id`, `type`, `title`, and `authors`; optional fields are `venue`, `date`, `status`, `url`, and `code`. Add only real entries. The website and PDF generator use this same data. Software/workflow contributions are selected separately from `projects.json`.

### PDF and HTML CV

The HTML CV reads the shared JSON data. `public/cv.pdf` is a checked-in asset generated from the same records by the optional Python script:

```sh
python3 -m venv .venv-cv
.venv-cv/bin/pip install reportlab
.venv-cv/bin/python scripts/generate-cv.py
npm run validate
```

Running the script explicitly overwrites `public/cv.pdf`; it never runs during website builds. Python is not required for Cloudflare Pages. After editing profile, research, project, or publication data, regenerate the PDF and visually inspect all pages, especially after adding content that changes pagination. Commit both the data and the PDF.

You may instead replace `public/cv.pdf` with an independently prepared CV, but then maintain its consistency with the HTML manually and do not run the generator over it. The current `cvIsDraft` value is `false`: the core education dates, RA start date, study level, and programming languages have been confirmed. Optional LinkedIn/degree-abbreviation details do not block the CV. Set it back to `true` when preparing an incomplete revision, then regenerate or replace the PDF. Remove the PDF's `X-Robots-Tag: noindex` rule in `public/_headers` only if you want it indexed. The HTML CV also has a print stylesheet.

### SEO and appearance

Edit colors, typography, and spacing in `src/styles/global.css`. System fonts eliminate font loading delay. All pages inherit metadata from `BaseLayout.astro`. `socialImage` accepts an optional supplied image path, otherwise image-specific OpenGraph tags are omitted. Text OpenGraph and Twitter metadata are included. Replace `public/favicon.svg` if desired.

Keep `site` in `astro.config.mjs` and `profile.siteUrl` aligned if the canonical domain changes. Sitemap and robots files are generated from the content. No fake dates or `lastmod` values are emitted. A real `404.html` prevents Cloudflare Pages from falling back to single-page-app routing.

## Deploy

Follow [DEPLOYMENT.md](DEPLOYMENT.md) for Cloudflare Pages, the public GitHub repository, HTTPS, and automatic updates from `main`. Deploy only `dist/`.

No license is assumed. Public visibility is not an open-source license grant; choose a source license if you want to grant reuse rights. No secrets belong in this repository.

## Hosting scope

Use Cloudflare Pages Free for this static site. Only `cv.qianoy.uk` is the website hostname. The existing `qianoy.uk` apex is used by the VPN and must keep its current DNS, origin, routes, and TLS settings. Do not apply a root-domain or zone-wide redirect for this website. No RackNerd changes, Pages Functions, paid plan, or billing setup is required. See `DEPLOYMENT.md` for the current launch status and exact subdomain-only steps.
