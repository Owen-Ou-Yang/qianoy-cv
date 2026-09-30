# cv.qianoy.uk - Academic website

Live: [cv.qianoy.uk](https://cv.qianoy.uk/) · [PDF CV](https://cv.qianoy.uk/cv.pdf) · [public source](https://github.com/Owen-Ou-Yang/qianoy-cv). Cloudflare Pages automatically publishes successful builds from `main`.

A complete, static Astro website for an academic profile in AI for materials and molecular simulation. It uses semantic HTML, system fonts, a shared CSS design system, and reusable Astro components. No frontend framework, external font requests, analytics, database, or client JavaScript is required.

The profile includes Qian Ouyang's confirmed contact details, Artificial Intelligence major and Experimental Class at Xi'an Jiaotong University (2023-2027, expected), RA role with Prof. Tengfei Luo at Notre Dame (October 2025-present), visiting-student and iSURE dates, and C++/Python skills. Three owner-approved research case studies connect an earlier UMA/FAIR-Chem workflow, a MACE GPU resource pilot, and preliminary polymer density screening. The first describes workflow development and the GPU-memory limits that motivated the owner's HPC interests; the other two present selected measurements with their limitations. Their concise `cvSummary` fields also supply the HTML and PDF CV research entries. JEPA results and coursework remain excluded; general JEPA research interests remain visible. No degree designation, publication, novel optimization algorithm, or general predictive accuracy is inferred. See [TODO.md](TODO.md) and [CONTENT_NOTES.md](CONTENT_NOTES.md).

## Develop locally

Use Node 22.23.3 (pinned in `.nvmrc`) or a compatible supported even-numbered Node version >=22.19.0. npm is the package manager; commit `package-lock.json`.

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
│   ├── figures/                   # Approved SVG/PNG figures and plotted CSV data
│   ├── social/profile.png         # Name and research-identity sharing preview
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
    │   ├── projects.json          # Three approved case studies and shared CV summaries
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

The homepage uses `profile.json`'s `overview` for a short identity and research introduction, followed by compact project entries. Each project's optional `preview` supplies its short listing title and description; the full title, methods, observations, figures, and limitations remain on its detail page. These presentation fields do not change the shared `cvSummary` or the PDF CV. The Research page is the main research index; existing project URLs remain available.

Typography and spacing favor quick reading: system sans-serif text, moderate headings, and one aligned column for project summaries. Detail pages provide section links and keep large scientific figures in a keyboard-accessible horizontal scroll region on narrow screens, with full-size image and data links.

### Profile, research, and links

Edit `src/data/profile.json` for identity, biography, education, academic experience, skills, and contact links. Replace `null` with verified values. Absent optional links are omitted rather than rendered as dead links. `name` supplies page titles and Person structured metadata. Edit `src/data/research.json` for research themes, descriptions, and keywords. `src/data/site.ts` holds the types and navigation.

Use a plain email address for `email` (the site adds `mailto:`), full HTTPS URLs for `github` and `linkedin`, and skill objects with `title` and `description`. Add verified languages to `programmingLanguages`; do not infer them from a project topic. A public email is visible to everyone. No contact form or data collection is included.

### Projects and optional figures

Edit `src/data/projects.json`. Each published record generates `/projects/<slug>/` automatically. `src/data/projects.ts` defines the field types:

- `slug`, `title`, `theme`, `summary`: identity and overview.
- `question`, `methodology`, `results`: a question string and lists of concrete methods/results.
- `resultsHeading`: optional outcomes heading, such as "What I built and learned" for a workflow.
- `workflow`: optional static schematic with a title, scope note, ordered `steps` (title and description), and an insight with a follow-up link. Keep this description distinct from measured results.
- `takeaway`, `scope`, `resultsNote`, and `limitations`: the main observation, study scope, interpretation, and limits. Keep the engineering pilot and preliminary screening labels next to their evidence.
- `date`: the actual evidence snapshot or study date; do not substitute a deployment date.
- `cvSummary`: a concise, bounded research description shared by the HTML CV and the optional PDF generator.
- `dataFile`: an optional public CSV URL for the approved plotted measurements; `references`: source attribution with optional notes about what each source establishes.
- `detailsTodo`: remaining information needed for the project record.
- `role` and `status`: personal contribution and actual project status; `repository`: a public HTTPS code URL or `null`.
- `published`: set to `true` only when the owner wants the record publicly displayed. Only published records generate detail pages or appear in the website/PDF. The public array currently contains three approved case studies: one workflow and two measurement studies.
- `selected`: show a published entry on the homepage.
- `isPlaceholder`: use `true` for a topic-only draft, which is excluded from indexing/sitemap. An actual ongoing project may use `false` without claiming completion.
- `output`: optional `{ "type": "Research software", "role": "..." }` (or `Research workflow`). This includes the project in research output and the HTML CV without creating a publication citation.
- `figure`: optional `{ "src": "/figures/filename.svg", "download": "/figures/filename.png", "width": 1680, "height": 864, "alt": "...", "caption": "..." }`. Use the actual dimensions, descriptive alt text, attribution, and interpretation limits. The current SVG figures have PNG download versions and small CSV files containing only the approved plotted measurements.

The homepage and Research page highlight the three approved case studies. The UMA/FAIR-Chem page at `/projects/uma-fairchem-polymer-workflow/` explains the elastic-response workflow and its connection to the owner's HPC research interests. Its HTML workflow schematic describes processing stages; it is not a scientific result figure. The MACE resource and density pages contain the approved SVG/PNG figures, plotted CSV data, methods, and limitations. Keep the original UMA elastic-response workflow distinct from later Tg/density paths under development; no validated UMA property values are reported. Coursework and JEPA results are not included. Other project drafts stay outside the public source. If no records are published, the empty `/projects/` route uses `noindex` and detail routes are not built. General research interests and tool experience remain visible.

When adding new records, note that `published: false` controls rendered output only. Confidential drafts must stay outside public source and public Git history.

### Publications and other citations

`src/data/publications.json` is intentionally empty. Allowed `type` values: `Publication`, `Preprint`, `Manuscript`, `Poster`, and `Talk`. Each entry needs `id`, `type`, `title`, and `authors`; optional fields are `venue`, `date`, `status`, `url`, and `code`. Add only real entries. The website and PDF generator use this same data. Software/workflow contributions can be selected separately from `projects.json`; the current three case studies do not set `output` and do not create publication or software-release citations.

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

Edit colors, typography, and spacing in `src/styles/global.css`. System fonts eliminate font loading delay. All pages inherit metadata from `BaseLayout.astro`. `socialImage` points to the local `public/social/profile.png` sharing preview; replace it with another approved image or use `null` to omit image-specific OpenGraph tags. Text OpenGraph and Twitter metadata remain included. The figures and sharing preview are static assets and add no client JavaScript. Replace `public/favicon.svg` if desired.

Keep `site` in `astro.config.mjs` and `profile.siteUrl` aligned if the canonical domain changes. Sitemap and robots files are generated from the content. No fake dates or `lastmod` values are emitted. A real `404.html` prevents Cloudflare Pages from falling back to single-page-app routing.

## Deploy

Follow [DEPLOYMENT.md](DEPLOYMENT.md) for Cloudflare Pages, the public GitHub repository, HTTPS, and automatic updates from `main`. Deploy only `dist/`.

No license is assumed. Public visibility is not an open-source license grant; choose a source license if you want to grant reuse rights. No secrets belong in this repository.

## Hosting scope

Use Cloudflare Pages Free for this static site. Only `cv.qianoy.uk` is the website hostname. Keep the existing `qianoy.uk` apex and all other application records unchanged. Do not apply a root-domain or zone-wide redirect for this website. No Pages Functions, paid plan, or separate server setup is required. See `DEPLOYMENT.md` for the current launch status and exact subdomain-only steps.
