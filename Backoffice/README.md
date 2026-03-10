# Backoffice

React Router front-end scaffold for a REST API driven backoffice.

## Structure

```text
app/
  components/   shared UI building blocks
  config/       app-level constants and environment defaults
  layouts/      reusable route shells
  lib/          low-level helpers such as the API client
  routes/       route modules
  services/     feature-facing data access and mock scaffolding
  types/        shared TypeScript models
```

## Development

```bash
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to set the API url

## Notes

- `app/lib/api-client.ts` is the fetch wrapper for REST calls.
- `app/services/` is where feature modules should call the API client.
- `app/routes/` should stay focused on rendering, loaders, and actions.
