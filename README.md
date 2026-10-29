# cv.qianoy.uk - Academic website

Live: [cv.qianoy.uk](https://cv.qianoy.uk/) · [PDF CV](https://cv.qianoy.uk/cv.pdf) · [public source](https://github.com/Owen-Ou-Yang/qianoy-cv). Cloudflare Pages automatically publishes successful builds from `main`.

A complete, static Astro website for an academic profile in AI for materials and molecular simulation. It uses semantic HTML, system fonts, a shared CSS design system, and reusable Astro components. No frontend framework, external font requests, analytics, database, or client JavaScript is required.

The profile includes Qian Ouyang's confirmed contact details, Artificial Intelligence major and Experimental Class at Xi'an Jiaotong University (2023-2027, expected), RA role with Prof. Tengfei Luo at Notre Dame (October 2025-present), undergraduate Non-degree Exchange Student studies at Notre Dame in Fall 2025, iSURE dates, and owner-confirmed programming and CRC experience. The exchange record includes a semester GPA of 3.917/4.0 over 12 credits and course-specific grades; it is separate from the XJTU degree and RA experience. As reviewed on 26 October 2026, seven research records follow two lines: molecular representations and physical prediction, and MLIP material properties and efficiency. Current work examines pretrained atomistic representations and prepares a crystal-property label-efficiency study; recent completed work compares controlled physical-response models. Earlier CG JEPA and MACE-water explorations remain available as archived case studies. The ongoing density workflow connects classical polymer preparation with MACE simulation and reference comparison; its approved September measurements remain historical examples. UMA remains background work with no validated property result. The application CV has an independent, conservative selection: two merged research topics under the Notre Dame RA role, shared education facts, one course project, and a short skills list. The owner-approved Driving Coach project appears separately as compact Computer Vision coursework, without changing the two research lines. No degree designation, publication, novel optimization algorithm, or general predictive accuracy is inferred. See [TODO.md](TODO.md) and [CONTENT_NOTES.md](CONTENT_NOTES.md).

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
    │   ├── CourseworkProjects.astro
    │   ├── Experience.astro
    │   ├── Skills.astro
    │   ├── PageHeader.astro
    │   ├── ProfileLinks.astro
    │   ├── ProjectEntry.astro
    │   ├── ResearchLine.astro
    │   └── Todo.astro
    ├── data/
    │   ├── profile.json           # Profile, XJTU/ND education, courses/grades, website skills
    │   ├── cv.json                # Explicit CV selection, merged research text, paragraphs, skills
    │   ├── cv.ts                  # Typed curated CV content and shared-fact lookup
    │   ├── coursework.json        # Approved Driving Coach course-project entry
    │   ├── research.json          # Research themes and descriptions
    │   ├── research-lines.json    # Two research lines, narratives, and project context
    │   ├── projects.json          # Seven website research records and historical summaries
    │   ├── publications.json      # Actual citations only; currently empty
    │   ├── site.ts                # Profile types, exports, navigation
    │   ├── projects.ts            # Project types and exports
    │   ├── coursework.ts          # Published coursework selection and types
    │   ├── research-lines.ts      # Shared line grouping and project lookup
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

The homepage uses `profile.json`'s `overview` for a short identity and research introduction, followed by two compact research lines and links to selected studies within each. It highlights the current atomistic-representation study and ongoing polymer-density workflow. Research and Projects separate current/recent work from earlier explorations within the same lines. Each project's optional `preview` supplies its short listing title and description; the full title, methods, observations, figures, and limitations remain on its detail page. Detail pages present the research question, approach, current progress, and findings in that order, with material limitations retained afterward. Backlinks and related-work links stay within the project's research line. The HTML and PDF CV instead use the same explicit selection in `cv.json`; website research-line order does not determine CV inclusion or pagination. Existing project URLs remain available.

Typography and spacing favor quick reading: system sans-serif text, moderate headings, and one aligned column for project summaries. Detail pages provide section links and keep large scientific figures in a keyboard-accessible horizontal scroll region on narrow screens, with full-size image and data links.

### Profile, research, and links

Edit `src/data/profile.json` for identity, biography, education, academic experience, skills, and contact links. Replace `null` with verified values. Absent optional links are omitted rather than rendered as dead links. `name` supplies page titles and Person structured metadata. `researchReviewedOn` records the date of the latest research-content review, rather than an experiment date or claim of live monitoring. Edit `src/data/research.json` for research themes, descriptions, and keywords. `src/data/site.ts` holds the types and navigation.

Use a plain email address for `email` (the site adds `mailto:`), full HTTPS URLs for `github` and `linkedin`, and skill objects with `title` and `description`. `programmingLanguages` and `skills` supply the existing About-page skill presentation. The application CV uses its own shorter list in `cv.json`. Do not infer personal proficiency from repository dependencies, imports, successful runs, or AI-assisted implementation; retain only owner-confirmed tools and contribution wording, without proficiency ratings. A public email is visible to everyone. No contact form or data collection is included.

### Education and exchange coursework

The homepage goes directly from the profile introduction and contact actions to Research lines. The About biography describes the exchange, RA, and iSURE chronology without repeating grades or credits. Its Education component uses “Undergraduate Exchange Student (non-degree)” with one adjacent date. The application CV reuses the same education facts in a compact presentation; underlying academic data is retained.

`profile.education` describes the XJTU undergraduate degree. `profile.exchangeEducation` separately records Notre Dame's Non-degree Exchange Student role, undergraduate exchange level, August-December 2025 dates, Fall 2025 term, semester GPA, credits, and course records. `semesterGpa: "3.917/4.0"` applies only to this 12-credit Notre Dame semester; it is neither an XJTU GPA nor a cumulative undergraduate GPA. Keep RA and iSURE entries in `experience` instead of merging them with education.

Each exchange course has `name`, `code`, `level`, `grade`, and the earlier `cvSelected` flag. The About education table shows all four confirmed grades: graduate-level Computer Vision (CSE 60535, A), undergraduate Natural Language Processing (CSE 40657, A), Computer Graphics (CSE 40166, A), and Human Computer Interaction (CSE 40424, A−). The curated CV explicitly selects the compact coursework information it needs from those shared records, for both HTML and PDF. One graduate-level course does not make the owner a graduate student.

### Course project

`src/data/coursework.json` and `coursework.ts` keep approved coursework separate from research projects and publication citations. `CourseworkProjects.astro` retains the About-page entry. The curated CV reuses the title, course, term, and instructor facts, but selects its own short paragraph in `cv.json` rather than importing the About bullets. The entry identifies Computer Vision at Notre Dame in Fall 2025, taught by Prof. Adam Czajka.

Driving Coach adapted an existing YOLOv1-style detector with a pretrained ResNet-18 backbone for BDD100K scenes. Its unseen Shenzhen highway-video evaluation was qualitative. Do not add mAP/accuracy claims, imply a new architecture, or describe the discussed but unimplemented local lane-geometry scheme as a delivered feature. `repository` remains `null` while no public project-code destination is confirmed. The October 28 request approves this specific course project; unrelated coursework and private reports remain excluded.

### Research lines

Edit `src/data/research-lines.json` for line-level introductions, progression narratives, project membership, and project context. `src/data/research-lines.ts` provides the typed grouping and lookup used by the pages; `ResearchLine.astro` supplies the shared presentation. General research interests remain in `research.json`, and each case study's methods and evidence remain in `projects.json`.

The molecular-representations line preserves the progression through CG JEPA and MACE-water diagnostics into controlled physical-response studies and current pretrained atomistic-representation research. The MACE-water exploration closed on 9 October 2026; it is no longer labeled ongoing. Current crystal label-efficiency work is in preparation and has no property-prediction or transfer result. The properties-and-efficiency line connects resource-limited UMA work, MACE property workflows, and resource evaluation. MACE supplies interactions for property simulations and pretrained features in the earlier representation study. Related motivation does not imply that one study validates another.

When adding a published case study, also assign it to the appropriate research line and write its context using confirmed work. A stage's optional `archive: true` places it among earlier explorations without changing its URL or evidence. Archive membership and CV selection are independent. Adding, publishing, or reordering a website stage never adds it to the CV. The curated CV merges related phases according to personal participation and the owner’s chosen narrative. UMA remains the last, subordinate case study within its line and is not a homepage study highlight.

### Projects and optional figures

Edit `src/data/projects.json`. Each published record generates `/projects/<slug>/` automatically. `src/data/projects.ts` defines the field types:

- `slug`, `title`, `theme`, `summary`: identity and overview.
- `question`, `methodology`, `results`: a question string and lists of concrete methods/results.
- `resultsHeading`: optional outcomes heading, such as "What I built and learned" for a workflow.
- `workflow`: optional static schematic with a title, scope note, ordered `steps` (title and description), and an insight with a follow-up link. Keep this description distinct from measured results.
- `takeaway`, `scope`, `resultsNote`, and `limitations`: the main observation, study scope, interpretation, and limits. Keep the engineering pilot and preliminary screening labels next to their evidence.
- `date`: the actual evidence snapshot or study date; do not substitute a deployment date.
- `reviewedOn`: optional date of the latest status/content review, kept distinct from `date` and from when an experiment ran.
- `cvSummary`: a retained historical website/project summary. The application CV no longer imports it automatically; selected CV paragraphs live in `cv.json`.
- `cvSelected`: retained historical selection metadata, no longer used by the application CV. Use `cv.json` to select or merge CV content.
- `dataFile`: an optional public CSV URL for the approved plotted measurements; `references`: source attribution with optional notes about what each source establishes.
- `detailsTodo`: remaining information needed for the project record.
- `role` and `status`: personal contribution and actual project status; `repository`: a public HTTPS code URL or `null`.
- `published`: set to `true` only when the owner wants the website record publicly displayed. Published records generate detail pages; this flag has no automatic effect on CV selection. The public array currently contains seven research records.
- `selected`: include a published entry among the homepage's linked studies within its research line.
- `isPlaceholder`: use `true` for a topic-only draft, which is excluded from indexing/sitemap. An actual ongoing project may use `false` without claiming completion.
- `output`: optional `{ "type": "Research software", "role": "..." }` (or `Research workflow`). This includes the project in website research output without creating a publication citation or automatically adding it to the CV.
- `figure`: optional `{ "src": "/figures/filename.svg", "download": "/figures/filename.png", "width": 1680, "height": 864, "alt": "...", "caption": "..." }`. Use the actual dimensions, descriptive alt text, attribution, and interpretation limits. The current SVG figures have PNG download versions and small CSV files containing only the approved plotted measurements.

The current representation entry at `/projects/pretrained-atomistic-representations/` describes reduced native Atom-JEPA QM9 comparisons and the preparation of a crystal-property extension. Pretraining effects depend on budget and optimization seed; no complete paper reproduction, universal JEPA advantage, or unseen-material transfer is claimed. The recent completed `/projects/controlled-physical-response/` study concerns synthetic hysteresis and SSM/GRU controls, not a validated real-material simulator. The earlier CG and MACE-water URLs remain available as archived explorations with their negative and task-dependent observations.

The ongoing `/projects/polymer-density-screening/` workflow connects classical RadonPy/GAFF2 preparation, MACE simulation, and reference comparison. Its existing approved September SVG/PNG figure and CSV values remain a historical three-polymer snapshot, not current campaign totals. The reference temperature is owner-confirmed as 300 K; phase, crystallinity, molecular weight, tacticity, preparation history, and other reference uncertainties still limit comparison. The GPU resource study retains its original engineering scope. UMA remains subordinate at `/projects/uma-fairchem-polymer-workflow/`, with no validated UMA property result; its HTML schematic illustrates processing stages. Keep the original UMA elastic-response workflow distinct from later Tg/density development. Only the specifically approved Driving Coach coursework summary is included separately; unrelated coursework, private research reports, and unpublished numerical results or figures remain excluded. If no records are published, the empty `/projects/` route uses `noindex` and detail routes are not built.

When adding new records, note that `published: false` controls rendered output only. Confidential drafts must stay outside public source and public Git history.

### Publications and other citations

`src/data/publications.json` is intentionally empty. Allowed `type` values: `Publication`, `Preprint`, `Manuscript`, `Poster`, and `Talk`. Each entry needs `id`, `type`, `title`, and `authors`; optional fields are `venue`, `date`, `status`, `url`, and `code`. Add only real entries. The website uses this citation data. CV additions require deliberate selection and owner confirmation; a project or software record is not a publication. The current seven research records do not set `output` and do not create publication or software-release citations.

### PDF and HTML CV

`src/data/cv.json` is the explicit content selection shared by the HTML CV and PDF generator. Its typed interface is in `cv.ts`. It selects two merged topics under the Notre Dame Research Assistant experience: **Machine learning for polymer simulation** (UMA/FAIR-Chem, MACE density, and GPU resource work) and **Representation learning for molecular dynamics** (CG polymer and MACE-water exploration). Each research topic stores an ordered `paragraphs` array, rendered as separate natural paragraphs in both formats. RA and iSURE identities/dates remain separate and reuse confirmed profile facts. The Driving Coach course project uses one short `paragraph`, while education/course and project metadata can be reused from `profile.json` and `coursework.json`.

The CV deliberately omits the independent Atom-JEPA/QM9, Bouc–Wen/state-space, and prepared crystal-extension entries. Their website records, results, and source material remain available for later consideration. The CV skills list currently retains only owner-confirmed Python and C++. Other installed or imported tools are not evidence of personal proficiency and must be confirmed before adding them.

The document begins with the name and clickable contacts, followed by Education, Research Experience, Course Project, and Skills. It omits the broad identity slogan, repeated line summaries, research-status labels, and bullets. Content uses short paragraphs. No `published`, project `cvSelected`, website research-line order, or forced line-based `PageBreak` determines the CV. Aim for a readable one-page document; use a second page only if genuinely important content requires it, without shrinking type or squeezing line spacing.

`public/cv.pdf` is a checked-in asset regenerated by the optional Python script:

```sh
python3 -m venv .venv-cv
.venv-cv/bin/pip install reportlab
.venv-cv/bin/python scripts/generate-cv.py
npm run validate
```

Running the script explicitly overwrites `public/cv.pdf`; it never runs during website builds. Python is not required for Cloudflare Pages. After changing the curated CV selection or any shared facts it consumes, regenerate the PDF, inspect every rendered page, and verify identity, dates, GPA scope, course level, links, and paragraph/page boundaries. Commit both the data and PDF. Changes to unrelated research archives alone should not change the CV.

Conservative contribution wording is intentional. Do not infer independent method design, implementation of all modules, familiarity with every tool, or a separate CV accomplishment from code, logs, reports, or AI-assisted execution. When participation or understanding is uncertain, omit the item from this version and keep a short review note instead of strengthening the claim.

You may replace `public/cv.pdf` with an independently prepared CV, but then maintain consistency with the HTML manually and do not run the generator over it. Optional LinkedIn/degree-abbreviation details do not block the CV. Remove the PDF's `X-Robots-Tag: noindex` rule in `public/_headers` only if you want it indexed. The HTML CV also has a print stylesheet.

### SEO and appearance

Edit colors, typography, and spacing in `src/styles/global.css`. System fonts eliminate font loading delay. All pages inherit metadata from `BaseLayout.astro`. `socialImage` points to the local `public/social/profile.png` sharing preview; replace it with another approved image or use `null` to omit image-specific OpenGraph tags. Text OpenGraph and Twitter metadata remain included. The figures and sharing preview are static assets and add no client JavaScript. Replace `public/favicon.svg` if desired.

Keep `site` in `astro.config.mjs` and `profile.siteUrl` aligned if the canonical domain changes. Sitemap and robots files are generated from the content. No fake dates or `lastmod` values are emitted. A real `404.html` prevents Cloudflare Pages from falling back to single-page-app routing.

## Deploy

Weekly research maintenance reviews are intended for Mondays at 10:00 Asia/Shanghai. When project evidence changes, prepare a pending editorial update for the owner; do not publish it automatically. Review status, methods, uncertainties, and the approved public scope before changing the shared data. A new experiment or a local completion file alone does not authorize release of its results, figures, or research directory.

Follow [DEPLOYMENT.md](DEPLOYMENT.md) for Cloudflare Pages, the public GitHub repository, HTTPS, and automatic updates from `main`. Deploy only `dist/`.

No license is assumed. Public visibility is not an open-source license grant; choose a source license if you want to grant reuse rights. No secrets belong in this repository.

## Hosting scope

Use Cloudflare Pages Free for this static site. Only `cv.qianoy.uk` is the website hostname. Keep the existing `qianoy.uk` apex and all other application records unchanged. Do not apply a root-domain or zone-wide redirect for this website. No Pages Functions, paid plan, or separate server setup is required. See `DEPLOYMENT.md` for the current launch status and exact subdomain-only steps.
