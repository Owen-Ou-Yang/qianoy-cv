# Deploy cv.qianoy.uk with Cloudflare Pages Free

The domain is **qianoy.uk**. The website target is **cv.qianoy.uk**. Keep all existing root-domain services and records unchanged. This website requires only a new `cv` custom domain. No separate server access is needed.

## Cost and scope

Use **Cloudflare Pages Free**, deploying only the static `dist/` output. Static asset requests are free and unlimited; the Free plan includes 500 builds per month, one concurrent build, up to 20,000 files, and a 25 MiB per-file limit. No Pages Functions, SSR, database, paid Workers plan, or billing setup is needed. These limits were checked on 2026-09-27; existing domain registration/renewal remains separate from hosting.

Sources: [static request pricing](https://developers.cloudflare.com/pages/functions/pricing/#static-asset-requests), [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Pages product/free signup](https://www.cloudflare.com/products/pages/).

## Current launch status

- Live canonical website: [https://cv.qianoy.uk](https://cv.qianoy.uk/), verified on 2026-09-28.
- Public GitHub repository created: `Owen-Ou-Yang/qianoy-cv`.
- Chrome access to the signed-in GitHub and Cloudflare accounts was restored on 2026-09-28.
- Initial launch commit `1e8c2e4` passed [GitHub Actions validation](https://github.com/Owen-Ou-Yang/qianoy-cv/actions/runs/36372847874) and automatically deployed successfully to Cloudflare Pages using Node 22.23.3. Later content updates continue through `main`.
- The owner approved the official Cloudflare GitHub app, scoped to **only** `Owen-Ou-Yang/qianoy-cv`. The Git-integrated Pages project deployed successfully at `https://qianoy-cv.pages.dev`; automatic production deployments from `main` are enabled.
- `cv.qianoy.uk` is **Active**, with **SSL enabled**. Its `cv` CNAME points to `qianoy-cv.pages.dev`.
- Initial launch checks passed for all six public pages, `/cv.pdf` (matching the local file), `/sitemap.xml`, `/robots.txt`, and genuine 404 responses. HTTP redirects to HTTPS while preserving path and query. No additional redirect rule was needed. Recheck changed pages and assets after each content deployment.
- The initial GitHub publication used a clean source snapshot. Subsequent content updates use ordinary commits to `main`; unpublished drafts and unrelated research documents remain outside public source.

## 1. Validate locally

```sh
cd qianoy-cv
nvm install
nvm use
npm ci
npm run validate
```

Node 22.23.3 is pinned in `.nvmrc`; `nvm` is optional if compatible Node is already installed. In a restricted environment use `ASTRO_TELEMETRY_DISABLED=1 npm run validate`.

The current content includes confirmed education, experience, and skills plus three owner-approved research case studies: an earlier UMA/FAIR-Chem workflow, a MACE GPU engineering pilot, and preliminary polymer density screening. The UMA workflow explains how practical GPU-memory constraints motivated the owner's HPC interests; it does not present quantitative UMA results. The HTML and PDF CV use the records' shared `cvSummary` fields. JEPA results and coursework remain excluded; general JEPA research interests remain visible. Review `TODO.md` for optional additions.

Keep the selected SVG/PNG figures, plotted CSV files, and social preview image in `public/`; they are ordinary static assets and add no JavaScript or hosting service. The UMA workflow schematic is rendered as static HTML and is not a scientific result figure. Check all three case-study pages, including `/projects/uma-fairchem-polymer-workflow/`, the two measurement studies' image/data downloads, and the updated PDF before publishing a content update. Regenerate and visually inspect the PDF when changing CV content, then run `npm run validate`. A prepared content revision is not confirmed live until its deployment and served pages have been checked.

## 2. Create the public GitHub repository and push

The repository already exists and source is published. The following steps are retained as a reproducible setup reference; do not recreate it. Local `main` tracks `origin/main`. Earlier unpublished history is preserved only in the local `codex/pre-publication-history` branch.

1. Sign in to [GitHub](https://github.com/new) as `Owen-Ou-Yang`.
2. Create **qianoy-cv** with **Public** visibility.
3. Do not initialize it with a README, `.gitignore`, or license; source and Git history already exist locally. No license is assumed.
4. In the project root, set your preferred Git identity for future commits:

```sh
git config user.name 'Qian Ouyang'
git config user.email 'YOUR VERIFIED OR GITHUB NO-REPLY EMAIL'
git branch -M main
git status
```

Commit any uncommitted site changes, then connect GitHub:

```sh
git add .
git commit -m 'Prepare academic website for cv.qianoy.uk'
git remote add origin https://github.com/Owen-Ou-Yang/qianoy-cv.git
git push -u origin main
```

Skip the commit if the tree is already clean. If `origin` exists, inspect it and reuse the correct remote instead of adding or overwriting it blindly. Authenticate with an existing authorized Git credential/SSH setup or `gh auth login` if GitHub CLI is installed; do not store access tokens in source, URLs, or Git configuration.

Source: [GitHub existing-source instructions](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## 3. Create a Git-integrated Pages project on the Free plan

1. Sign in to the Cloudflare account managing `qianoy.uk`.
2. Open **Workers & Pages -> Create application -> Pages -> Import an existing Git repository / Connect to Git**. Dashboard labels may vary.
3. Connect GitHub and select only `Owen-Ou-Yang/qianoy-cv` when choosing repository access.
4. Use these build settings:

| Setting | Value |
| --- | --- |
| Project name | `qianoy-cv`, if available |
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run validate` |
| Build output directory | `dist` |
| Root directory | Blank, because the website is at repository root |
| Environment variable | `NODE_VERSION` = `22.23.3` |
| Optional environment variable | `ASTRO_TELEMETRY_DISABLED` = `1` |

`npm run validate` runs diagnostics, the static build, and output checks. Install devDependencies; do not set an install option that omits them. No Cloudflare Astro adapter is needed. Select the Free plan and do not enable any paid add-on.

5. Save and deploy. Wait for success and open the exact `https://<project>.pages.dev` URL returned by Cloudflare.
6. Verify every navigation route, `/cv.pdf`, `/sitemap.xml`, `/robots.txt`, and an unknown route returning 404.

Start with Git integration, because a Direct Upload project cannot later be converted to Git integration. The user requested public GitHub source and automatic updates from `main`.

Sources: [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [static Astro settings](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Direct Upload limitation](https://developers.cloudflare.com/pages/get-started/direct-upload/), [build image](https://developers.cloudflare.com/pages/configuration/build-image/).

## 4. Bind only cv.qianoy.uk

1. In the Pages project, open **Custom domains -> Set up a domain**.
2. Enter **cv.qianoy.uk** and continue.
3. Inspect any existing `cv` record. If it already serves another application, resolve that conflict before replacing it. Leave all other records untouched.
4. Review and confirm only the proposed `cv` CNAME pointing to the exact Pages hostname. Cloudflare can create it automatically for a zone managed in the account.
5. Wait until the custom domain and certificate show **Active**.

Do not merely create the CNAME without first registering `cv.qianoy.uk` in the Pages project; this can cause a 522 response. Do not change the apex `qianoy.uk`, `www`, other application records, nameservers, MX/TXT records, or zone-wide redirects.

The `www` redirect from the original, mistaken domain plan is deliberately omitted. `cv.qianoy.uk` is the canonical website address; neither `www.qianoy.uk` nor `www.cv.qianoy.uk` is needed.

Source: [Pages custom subdomain setup](https://developers.cloudflare.com/pages/configuration/custom-domains/#add-a-custom-subdomain).

## 5. HTTPS without changing other services

Pages provisions HTTPS for its activated custom domain. Wait for the certificate to be active. Keep the zone's existing TLS mode and certificate settings.

If HTTP does not already redirect to HTTPS for `cv.qianoy.uk`, add one narrowly scoped **Single Redirect**:

| Setting | Value |
| --- | --- |
| Match | Wildcard pattern |
| Request URL | `http://cv.qianoy.uk/*` |
| Target URL | `https://cv.qianoy.uk/${1}` |
| Status code | `301` |
| Preserve query string | Enabled |

Review existing rules for conflicts first. Do not enable a new zone-wide redirect or change root-domain behavior for this website.

Verify live responses:

```sh
curl -I https://cv.qianoy.uk/
curl -I https://cv.qianoy.uk/cv.pdf
curl -I 'http://cv.qianoy.uk/research/?ref=test'
curl -I https://cv.qianoy.uk/sitemap.xml
curl -I https://cv.qianoy.uk/this-page-does-not-exist/
```

Expect HTTPS pages/PDF to return 200, HTTP to redirect to the same HTTPS path and query, and the missing page to return 404. Verify the PDF's content type and inspect the served canonical URLs. Keep other services unchanged; limit website configuration to the new subdomain.

Sources: [Cloudflare HTTPS](https://developers.cloudflare.com/ssl/get-started/), [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).

## 6. Automatic deployments

In the Pages project's branch settings, retain `main` as the production branch and enable automatic production deployments. A pushed content change triggers a new build; the GitHub Actions workflow independently validates the source. No deployment token needs to be checked into this repository.

```sh
git add src/data/profile.json public/cv.pdf
git commit -m 'Update academic profile'
git push origin main
```

Check that the Pages deployment references that commit, succeeds, and the changed content appears at `https://cv.qianoy.uk`. A failed `npm run validate` command prevents the new Pages build from publishing.

Source: [Pages branch controls](https://developers.cloudflare.com/pages/configuration/git-integration/).
