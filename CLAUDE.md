# Quaglio Scripts — Working Rules

## ⛔ STAGING-ONLY RULE (most important)

**Every change I ask for goes into STAGING files only. Never edit the prod snapshots directly.**

For any project in `projects/<name>/`:

| Edit these (STAGING) | NEVER touch these (PROD) |
| --- | --- |
| `script.js`  | `script.prod.js` |
| `styles.css` | `styles.prod.css` |

- All code changes, new features, fixes, and edits → **only** `script.js` / `styles.css`.
- The `*.prod.js` / `*.prod.css` files are **frozen snapshots**. They change **only** when the user runs `push prod`, which copies the staging file over the prod file.
- Do **not** hand-edit, sync, or "also update" the prod files when making changes — even if it seems helpful. Leaving them stale is correct; that is what keeps the live site stable until an explicit promotion.
- Do **not** run `push prod` / `./deploy.sh prod` on your own. Only the user decides when staging is promoted to prod.

When unsure whether a change should hit prod: it should not. Staging only.

## Deploy model

- **Staging** = the `.webflow.io` site → loads `script.js` / `styles.css` (live working files, always fresh).
- **Production** = the custom domain → loads `script.prod.js` / `styles.prod.css` (frozen snapshots).
- `push staging` → commits + pushes everything, updates STAGING behavior only. Safe; never changes the live site's code path.
- `push prod` → user picks the project, confirms by typing its name, then `script.js` is snapshotted into `script.prod.js` and pushed live.
- Files are served from the Vercel CDN at `https://quaglio-scripts.vercel.app/projects/<name>/<file>`.
- Each project's Webflow embed (`embed.html`) auto-selects staging vs prod by hostname (`.webflow.io` → staging, custom domain → prod).

## Scripts

- `push.sh` / `deploy.sh` (repo root) are shared across all projects via a project picker — no per-project deploy script needed.
- `sync.sh` — plain git sync helper.
