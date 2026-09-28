# Remaining optional content and maintenance

Updated on 2026-09-28. Core profile and CV facts are confirmed. The owner approved three research case studies: an earlier UMA/FAIR-Chem workflow, the MACE GPU engineering pilot, and preliminary polymer density screening. The owner confirmed that GPU-memory constraints encountered in the UMA work motivated their HPC optimization interests. Other project results, including JEPA and coursework, remain excluded.

## Confirmed and incorporated

- [x] Qian Ouyang; public email `qouyang@nd.edu`; connected GitHub profile `Owen-Ou-Yang`.
- [x] Xi'an Jiaotong University: undergraduate, Artificial Intelligence major, Artificial Intelligence Experimental Class (人工智能拔尖班), currently fourth year.
- [x] Enrollment in 2023; expected graduation in 2027. No months are inferred.
- [x] RA in Prof. Tengfei Luo's group, Department of Aerospace and Mechanical Engineering, University of Notre Dame: October 2025 - Present.
- [x] Notre Dame visiting student: August - December 2025.
- [x] Notre Dame iSURE summer research: July - September 2026.
- [x] Programming languages: C++ and Python. No proficiency rating is assumed.
- [x] CRC experience, independent VPN setup, and experience with UMA/FAIR-Chem and MACE.
- [x] Preserve MLIP HPC optimization and molecular/JEPA/coarse-graining interests without inventing results.
- [x] Add the two approved measurement studies with SVG/PNG figures, plotted CSV data, methods, and visible limitations.
- [x] Add the approved UMA/FAIR-Chem workflow case study at `/projects/uma-fairchem-polymer-workflow/`, with an HTML schematic and the owner-confirmed motivation for HPC research. Keep the original elastic-response workflow separate from later Tg/density development; no quantitative UMA validation is claimed.
- [x] Use each case study's short `cvSummary` entry in the HTML and PDF CV.
- [x] Keep JEPA results and coursework outside the public project records; retain general JEPA research interests.
- [x] Add a local sharing preview image without introducing client JavaScript.
- [x] Regenerate the PDF using the same records as the HTML CV; remove the obsolete draft/TODO notices for confirmed core fields.

## Optional details, not blockers

Edit `src/data/profile.json` if you want to add:

- [ ] LinkedIn URL, or omit it. It is omitted from all public profile links while unavailable.
- [ ] Official English degree designation (e.g. only if confirmed by the institution). Current wording states undergraduate studies and the major without claiming B.Eng./B.Sc.
- [ ] Additional verified tools, frameworks, or skills and proficiency, if useful.

No GPA, awards, publications, or service entries are assumed or required. `src/data/publications.json` intentionally remains empty.

## Research maintenance

- [ ] Replace the density reference table with fully traced, condition-matched references when available; do not infer phase, temperature, molecular weight, or experimental uncertainty.
- [ ] Add repeated measurements or independent preparations only after those experiments exist and their public scope is approved. Until then, keep the single-run engineering and single-packing screening limits explicit.
- [ ] Add a public HPC code link if a suitable repository is later released. The current case study makes the plotted measurements available without assuming the underlying research repository is public.
- [ ] Add quantitative UMA property or optimization results only after they exist, have been checked, and are approved for public release. A workflow implementation or schematic does not establish scientific validation.

No additional project is required for this version. Future records belong in `src/data/projects.json` only after their content is approved for publication. Keep `cvSummary`, the workflow description, figures, CSV files, attribution, and limits consistent; regenerate the PDF and run `npm run validate` after content changes. The present authorization covers the UMA workflow and the two selected measurement studies, not all research documents or future results.

Unpublished project drafts remain excluded from public source and public Git history.

## Public launch

- [x] Correct domain: `qianoy.uk`; website hostname: `cv.qianoy.uk`. Preserve existing root-domain services and records.
- [x] Cloudflare Pages Free supports this static site; no Functions or paid resources needed.
- [x] Connected GitHub account identified: `Owen-Ou-Yang`.
- [x] Restore an operable browser session. On 2026-09-28 Chrome pages and both signed-in accounts became accessible.
- [x] Create public repository `Owen-Ou-Yang/qianoy-cv`.
- [x] Publish the initial validated source; GitHub Actions passed for launch commit `1e8c2e4`.
- [x] Owner approved installation of the official Cloudflare GitHub app, restricted to `Owen-Ou-Yang/qianoy-cv`; Pages Git integration is complete.
- [x] Add only `cv.qianoy.uk` as a Pages custom domain. Domain Active, SSL enabled, HTTPS and the live PDF verified. No other hostname was redirected or repointed.
- [x] Verify automatic deployments from `main`: commit `1e8c2e4` deployed successfully using Node 22.23.3.
- [ ] Configure your preferred local Git author identity for future commits.
- [ ] Review on a phone, with keyboard navigation, and at 200% browser zoom before using it for applications.
- [ ] Choose a source-code license if desired. No reuse license has been assumed.
