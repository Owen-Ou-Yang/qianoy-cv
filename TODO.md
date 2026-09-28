# Remaining optional content and launch steps

Updated on 2026-09-28. Core profile and CV facts are confirmed. Projects are temporarily withheld by request, so project details and repository links are not needed for this version.

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
- [x] Temporarily hide all project entries, detail pages, project-derived software outputs, and CV project sections. Retain drafts only in local ignored storage/history; the public project array is empty.
- [x] Regenerate the PDF using the same records as the HTML CV; remove the obsolete draft/TODO notices for confirmed core fields.

## Optional details, not blockers

Edit `src/data/profile.json` if you want to add:

- [ ] LinkedIn URL, or omit it. It is omitted from all public profile links while unavailable.
- [ ] Official English degree designation (e.g. only if confirmed by the institution). Current wording states undergraduate studies and the major without claiming B.Eng./B.Sc.
- [ ] Additional verified tools, frameworks, or skills and proficiency, if useful.
- [ ] Optional social preview image (`socialImage`). Text metadata is already supported.

No GPA, awards, publications, or service entries are assumed or required. `src/data/publications.json` intentionally remains empty.

## Projects deferred

No project information is requested for the current version. When you decide to add projects later, add publishable records to `src/data/projects.json`, supply only approved details/code links, and set `published` to `true`. Then regenerate the PDF and run `npm run validate`.

Unpublished project drafts are excluded from this public source snapshot. Earlier local history containing drafts will remain local rather than being pushed to the new repository.

## Public launch

- [x] Correct domain: `qianoy.uk`; website hostname: `cv.qianoy.uk`. Preserve existing root-domain services and records.
- [x] Cloudflare Pages Free supports this static site; no Functions or paid resources needed.
- [x] Connected GitHub account identified: `Owen-Ou-Yang`.
- [x] Restore an operable browser session. On 2026-09-28 Chrome pages and both signed-in accounts became accessible.
- [x] Create public repository `Owen-Ou-Yang/qianoy-cv`.
- [x] Publish the validated source; GitHub Actions passed for commit `6b170e8`.
- [ ] Confirm installation of the official Cloudflare GitHub app, restricted to `Owen-Ou-Yang/qianoy-cv`, then complete Pages Git integration.
- [ ] Add only `cv.qianoy.uk` as a Pages custom domain; verify HTTPS and the live PDF. Do not redirect or repoint `qianoy.uk` or `www.qianoy.uk`.
- [ ] Verify automatic deployments from `main`.
- [ ] Configure your preferred Git author identity for future commits. Automated commits use the site-builder identity.
- [ ] Review on a phone, with keyboard navigation, and at 200% browser zoom before using it for applications.
- [ ] Choose a source-code license if desired. No reuse license has been assumed.
