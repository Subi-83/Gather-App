# Client Workspace

This is the frontend for Gather Chat, built with React and Vite.

## Recommended Usage

Run commands from the repository root whenever possible:

```bash
npm run dev
```

That starts both the client and server together.

## Client-only Commands

If you need to run frontend commands only, from this directory:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Deployment

Set this environment variable for production builds:

- `VITE_BACKEND_URL=https://your-backend-domain`

### Vercel

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

This folder includes SPA rewrite configs for both hosts.
