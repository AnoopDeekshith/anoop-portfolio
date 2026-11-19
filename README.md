# anoop-sites

Monorepo (npm workspaces) for my personal sites.

```
apps/
  portfolio/   The interactive chip-design portfolio (Next.js 16, GSAP, framer-motion)
  resume/      Simple, recruiter-friendly site for job applications (Next.js 16, server-only)
packages/
  content/     @anoop/content: profile, experience, projects, skills, education, writing
```

## Getting started

```bash
npm install            # once, from the repo root

npm run dev            # resume site      → http://localhost:3001
npm run dev:portfolio  # portfolio site   → http://localhost:3000

npm run build          # build every app
npm run typecheck      # typecheck every workspace
```

## Editing content

Edit the files in `packages/content/src/`. The resume site reads all of its text
from there, so updating a bullet or adding a project is a one-file change.

- `profile.ts`: name, headline, summary, links
- `experience.ts`: jobs and education
- `projects.ts`: projects (`featured: false` hides one from the resume site)
- `skills.ts`: skill groups
- `writing.ts`: articles (only `published: true` ones are shown)

### Resume site pages and images

Pages: `/` (home), `/experience`, `/projects`, `/resume`, `/contact`.
Nav, image paths and captions are configured in `apps/resume/site.ts`.
Drop images into `apps/resume/public/` — any missing image shows a placeholder
with the path it expects:

- `images/cover.png`: home hero (also the fallback banner for inner pages)
- `images/about-1.jpg`, `images/about-2.jpg`: photos beside the home intro
- `images/pages/experience.jpg`, `images/pages/projects.jpg`: page banners
- `images/projects/<slug>.jpg`: one per project (slugs are in `projects.ts`)

The contact form emails you via Resend when `RESEND_API_KEY` is set; without
it, the form opens a prefilled email draft instead.

The portfolio app still has its content inline in its components; it can be
migrated to `@anoop/content` incrementally.

The resume PDF is served from each app's `public/resume.pdf`; update both copies
when it changes.

## Adding another app

1. Create `apps/<name>/` with its own `package.json` (name it `@anoop/<name>`).
2. Add `"@anoop/content": "*"` to its dependencies and
   `transpilePackages: ["@anoop/content"]` to its `next.config.ts`.
3. Run `npm install` from the root.

## Deploying (Vercel)

Each app is its own Vercel project pointed at this repo, with **Root Directory**
set to `apps/portfolio` or `apps/resume`. Vercel detects npm workspaces and
installs from the root automatically.
