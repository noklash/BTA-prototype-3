# Deployment

The target platform is **Vercel**. The application is a standard Next.js App Router
project with no custom server, so it deploys without special configuration. The steps
below are the intended deployment procedure and have **not** been executed in this
repository (there is no connected Vercel project and no Git remote), so treat them as
instructions rather than as verified output.

## 1. Prerequisites

- The project pushed to a Git repository (GitHub, GitLab or Bitbucket).
- A Sanity project and dataset, already seeded (`docs/sanity-setup.md`).
- A shared secret for the revalidation webhook:

  ```bash
  node -e "console.log(crypto.randomUUID())"
  ```

## 2. Import the project into Vercel

1. In Vercel, **Add New → Project** and import the repository.
2. Framework preset: **Next.js** (detected automatically).
3. Build command: `npm run build` (default). Output directory: default.
4. **Node.js Version**: 22.x (Next.js 16 requires Node 20.19+; 22.x is a safe default).

No `vercel.json` is required.

## 3. Environment variables

Add these under **Project → Settings → Environment Variables**, for the **Production**
environment (and **Preview** if you want preview deployments to read real content):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project id |
| `NEXT_PUBLIC_SANITY_DATASET` | your dataset (for example `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-02-19` (optional) |
| `NEXT_PUBLIC_SITE_URL` | the deployed origin, for example `https://heritage-circle.vercel.app` |
| `SANITY_REVALIDATE_SECRET` | the secret generated in §1 |
| `SANITY_API_READ_TOKEN` | only if the dataset is **private** |

Notes:

- Do **not** set `SANITY_API_WRITE_TOKEN` on Vercel. It is only used by `npm run seed`,
  which you run locally.
- `NEXT_PUBLIC_SITE_URL` drives canonical URLs, the sitemap and Open Graph metadata.
  Leaving it unset makes those point at `http://localhost:3000`. Set it to the real
  origin (including the scheme, without a trailing slash).
- Only `NEXT_PUBLIC_*` values are exposed to the browser. The secret and the read token
  stay server-side.

## 4. On-demand revalidation webhook

Time-based ISR refreshes pages every two minutes. To make an editor's **Publish** appear
immediately, add a webhook:

1. In **manage.sanity.io → API → Webhooks**, create a webhook.
2. **URL**:

   ```
   https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
   ```

3. **Trigger on**: Create, Update, Delete.
4. **Filter**: leave empty (the handler scopes work by document `_type`).
5. **Projection**: `{_type}` — the handler only needs the document type to choose which
   cache tags to expire.
6. Save.

The endpoint returns `503` when `SANITY_REVALIDATE_SECRET` is not set on the server and
`401` when the secret does not match, so a misconfiguration is visible rather than silent.
You can check it from a terminal:

```bash
curl -i -X POST "https://<your-domain>/api/revalidate?secret=<secret>" \
  -H "content-type: application/json" -d '{"_type":"event"}'
```

Expected: `200` with `{ "revalidated": true, ... }`.

## 5. Build and runtime behaviour on Vercel

- `npm run build` prerenders the four content pages and every published event, and
  registers `/api/*` and `/studio` as dynamic.
- If Sanity is unreachable **during the build**, the build does not fail: the content
  queries degrade to empty results and the pages are generated with their explicit
  states. The pages then refresh on demand once Sanity is reachable again.
- `/studio` is `force-dynamic` and therefore never prerendered or cached by the CDN.
- Page data is cached with `revalidate = 120`; the webhook (§4) overrides that.

## 6. CORS for the deployed origin

The embedded Studio runs in the browser at `/studio`, so the deployed origin must be
allowed in Sanity:

**manage.sanity.io → API → CORS origins → Add origin**, with
`https://<your-domain>` and **Allow credentials** enabled. Add both the production and any
preview origins you intend to use the Studio from.

## 7. Post-deploy checklist

- [ ] `https://<your-domain>/` renders the seeded hero and mission (not a setup state).
- [ ] `/events` lists the upcoming events and shows the past event as a secondary entry.
- [ ] The seeded draft event does **not** appear anywhere.
- [ ] `/studio` loads the Studio and can read the singletons.
- [ ] `POST /api/membership-inquiry` with a valid body returns
      `{ "ok": true, "demonstration": true, ... }`.
- [ ] The webhook returns `200`, and publishing a change updates the site within seconds.
- [ ] `/sitemap.xml` and `/robots.txt` use the production origin.

## 8. Rollback

Vercel keeps every deployment; use **Deployments → … → Promote to Production** (or
**Instant Rollback**) to return to a previous build. Because content lives in Sanity, a
rollback only reverts code, not content — revert the content in the Studio if needed.

## 9. Deploying elsewhere

Any host that can run `next build` and `next start`, or a Vercel-compatible adapter, will
work. Two things must carry over:

1. The environment variables from §3.
2. A Node runtime of 20.19+ — and, only if you intend to run the seeder on the host,
   Node 22.6+ for the TypeScript seed script.

There is no database, queue or background worker to provision.
