# Autocycle frontend

Next.js app for the collaboration flow: a company either has a plastic or needs one, the API suggests partner brands, and a chosen pair becomes a product concept.

The browser calls the CloudFront API directly. Copy `.env.example` to `.env.local` to point at another backend.

```bash
npm run dev
npm run ci
```

`npm run ci` runs lint, Prettier, the TypeScript check, and Vitest.

## Deployment (AWS Amplify)

Pushing to `main` deploys the app on Amplify Hosting in `eu-central-1` (Next.js SSR). `amplify.yml` uses Node 24, runs `npm ci`, writes `NEXT_PUBLIC_API_URL` into `.env`, then `npm run build`.

| Variable              | Description                                     |
| --------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | CloudFront API origin, without a trailing slash |
