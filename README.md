# Autocycle frontend

Next.js app for the collaboration flow: a company either has a plastic or needs one, the API suggests partner brands, and a chosen pair becomes a product concept.

Requests go to `/backend/*`, which Next proxies to `API_URL` (the CloudFront API). Copy `.env.example` to `.env.local` to point at another backend.

```bash
npm run dev
npm run ci
```

`npm run ci` runs lint, Prettier, the TypeScript check, and Vitest.
