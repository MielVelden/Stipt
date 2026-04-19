# CI/CD Specification

## Purpose

This specification is written for an AI agent that will implement the initial CI/CD setup for this repository.

The goal is to:

- define the production hosting structure for the backend and backoffice
- define the Docker-based deployment model for a VPS
- define the GitHub Actions workflows for pull requests and for deployment to `development`
- keep the implementation simple, reproducible, and easy to operate

## Current Repository Context

- The backend is an ASP.NET application in `Backend/Backend.Web`.
- The backend auto-runs EF Core migrations and seeding on startup.
- In development, the backend uses .NET user-secrets for sensitive values such as the JWT secret and seed user password.
- The backend requires runtime configuration for:
  - `ConnectionStrings__Default`
  - `Jwt__SecretKey`
  - `Seeder__SeedUserPassword`
  - `Cors__AllowedOrigins__0`
- The backoffice is a React app in `Backoffice`.
- The mobile app is a React Native / Expo app in `Mobile`.
- There is already a root `docker-compose.yml`, but it currently only provisions PostgreSQL for local development.
- There are basic Dockerfiles for:
  - `Backend/Backend.Web/Dockerfile`
  - `Backoffice/Dockerfile`

## Architectural Decision

Use this deployment model:

- A VPS runs Docker and Docker Compose.
- Traefik is the public reverse proxy and TLS terminator.
- The backend and backoffice run as separate containers on an internal Docker network.
- PostgreSQL also runs in Docker on the same VPS for now.
- Only Traefik exposes ports publicly.

Routing rules for the single public domain `stipt.slempers.nl`:

- `https://stipt.slempers.nl/api...` -> backend
- all other paths on `https://stipt.slempers.nl/...` -> backoffice

TLS requirements:

- Traefik must automatically manage SSL certificates using Let's Encrypt.
- HTTPS must be the default entrypoint.
- HTTP on port 80 must redirect to HTTPS.

## Deployment Strategy

Use GitHub Actions to build and publish Docker images, then deploy those images to the VPS over SSH.

Preferred approach:

- Build Docker images in GitHub Actions.
- Push images to GHCR.
- SSH into the VPS.
- Pull the published images.
- Run `docker compose up -d` on the VPS.

Do not use "git pull on the VPS and build locally on the server" as the primary strategy.

Reason:

- CI-built images are more reproducible.
- Deployments are faster and more deterministic.
- The VPS does not need a full build toolchain for .NET and Node.
- Rollback is easier when images are tagged by commit SHA.

## Required Deliverables

The implementation agent should create or update the following:

- a production deployment compose file, preferably `deploy/docker-compose.yml`
- a deployment environment template, for example `deploy/.env.example`
- Traefik configuration via Docker Compose labels and/or a small static config if necessary
- GitHub Actions workflow files under `.github/workflows/`
- any small documentation updates needed in `README.md`
- verification and correction of the existing backend and backoffice Dockerfiles if needed for reliable CI/CD use

Important:

- Do not repurpose the current root `docker-compose.yml` if that would break local development.
- Keep the existing root compose file for local PostgreSQL unless there is a clean override strategy.
- Prefer adding a dedicated deployment stack under `deploy/`.

## Production Stack Requirements

The production Docker Compose stack must contain these services:

- `traefik`
- `postgres`
- `backend`
- `backoffice`

### Networks

Use at least:

- one public-facing network for Traefik routing
- one internal/private network for app-to-database traffic

It is acceptable to use a single shared network if implementation simplicity demands it, but the preferred setup is:

- `proxy` network: Traefik <-> app containers
- `internal` network: backend <-> postgres

### Volumes

Use named volumes for:

- PostgreSQL data
- Traefik ACME certificate storage

### Traefik Requirements

Traefik must:

- expose ports `80` and `443`
- enable the Docker provider
- not expose containers by default
- define entrypoints for `web` and `websecure`
- redirect `web` to `websecure`
- use Let's Encrypt ACME with a persistent storage file
- use the domain `stipt.slempers.nl`

ACME implementation details:

- use HTTP challenge on port `80` unless DNS challenge is explicitly needed later
- store certificates in a persistent volume, for example `/letsencrypt/acme.json`

### Backend Container Requirements

The backend container must:

- use the existing Dockerfile in `Backend/Backend.Web/Dockerfile`
- not expose ports publicly through Docker Compose
- be reachable only through Traefik
- receive the required environment variables via Compose env vars
- connect to PostgreSQL using the Docker service name, not `localhost`

Required production environment variables for backend:

- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://+:8080`
- `ConnectionStrings__Default=Host=postgres;Port=5432;Database=stipt_backend;Username=...;Password=...`
- `Jwt__Issuer=stipt-backend`
- `Jwt__Audience=stipt-frontend`
- `Jwt__SecretKey=...`
- `Seeder__SeedUserPassword=...`
- `Cors__AllowedOrigins__0=https://stipt.slempers.nl`

Secret handling note:

- keep .NET user-secrets as the development-only mechanism
- do not try to use .NET user-secrets in production containers
- in production, inject secrets through Docker Compose environment variables sourced from the VPS env file

Traefik routing requirements for backend:

- host: `stipt.slempers.nl`
- path prefix: `/api`
- higher priority than the backoffice catch-all route

### Backoffice Container Requirements

The backoffice container must:

- use the existing Dockerfile in `Backoffice/Dockerfile`
- not expose ports publicly through Docker Compose
- be reachable only through Traefik
- serve all non-`/api` traffic for `stipt.slempers.nl`
- be verified to work as a production image, and be corrected if the current Dockerfile is incomplete or inconsistent with the app runtime model

Backoffice runtime/build configuration:

- set `VITE_API_BASE_URL=/api` for production builds
- the result must work behind the same public domain as the backend

Traefik routing requirements for backoffice:

- host: `stipt.slempers.nl`
- catch-all path rule
- lower priority than the backend `/api` route

### PostgreSQL Requirements

The PostgreSQL service must:

- use an official PostgreSQL image
- persist its data in a named volume
- not expose its port publicly in production
- use credentials from env vars

## Dockerfile Verification Requirements

The implementation agent must explicitly verify the existing Dockerfiles before building the CI/CD workflow.

Files to verify:

- `Backend/Backend.Web/Dockerfile`
- `Backoffice/Dockerfile`

Verification goals:

- the images build successfully in CI
- the final containers start correctly in production
- the exposed/internal ports match the runtime assumptions used by Traefik
- the Dockerfiles copy the correct files from the repository layout
- the build context assumptions are correct
- no development-only behavior is required at runtime inside the production containers

If either Dockerfile is not suitable, the implementation agent should fix it as part of the CI/CD implementation instead of working around it in the workflows.

## GitHub Container Registry Requirements

Use GHCR for published deployment images.

Images to publish:

- `ghcr.io/<owner>/stipt-backend`
- `ghcr.io/<owner>/stipt-backoffice`

Tagging strategy:

- `development`
- full commit SHA

Optional later:

- semantic version tags for releases

## GitHub Actions Workflows

Create four workflows.

### 1. Backend PR Workflow

Trigger:

- `pull_request`

Suggested path filter:

- `Backend/**`
- `.github/workflows/backend-pr.yml`

Requirements:

- use the .NET SDK version required by the repo
- restore dependencies
- build the backend solution
- run backend unit tests

Recommended commands:

- `dotnet restore Backend/Backend.sln`
- `dotnet build Backend/Backend.sln --configuration Release --no-restore`
- `dotnet test Backend/Backend.sln --configuration Release --no-build`

Recommended additions:

- upload test results if practical
- enable NuGet caching

### 2. Backoffice PR Workflow

Trigger:

- `pull_request`

Suggested path filter:

- `Backoffice/**`
- `Backend/Backend.Web/**`
- `.github/workflows/backoffice-pr.yml`

Reason for including backend path:

- backend builds generate frontend DTO types, and API contract changes can affect the backoffice even if the React code itself did not change

Requirements:

- use Node.js 20
- install dependencies with `npm ci`
- run type checking
- run a production build

Recommended commands:

- `npm ci`
- `npm run typecheck`
- `npm run build`

Recommended additions:

- enable npm caching
- consider adding formatting or lint validation later if scripts are introduced

### 3. Mobile PR Workflow

Trigger:

- `pull_request`

Suggested path filter:

- `Mobile/**`
- `Backend/Backend.Web/**`
- `.github/workflows/mobile-pr.yml`

Requirements:

- use Node.js 20
- install dependencies with `npm ci`
- validate TypeScript
- validate Expo project health
- run a non-signed build-equivalent check that proves the bundle compiles

Implementation guidance:

- if the project does not already have scripts for this, add explicit CI commands
- prefer a command that verifies bundling without requiring store signing credentials

Recommended checks:

- `npx tsc --noEmit`
- `npx expo-doctor`
- an Expo export/bundling check suitable for CI

If a true native build is too heavy for the initial version, it is acceptable for the first pass to use:

- TypeScript validation
- Expo doctor
- JS bundle/export validation

### 4. Development Deploy Workflow

Trigger:

- `push` to `development`

This workflow must:

- build the backend Docker image
- build the backoffice Docker image
- push both images to GHCR
- deploy the updated stack to the VPS over SSH

Workflow stages:

1. Checkout repository
2. Authenticate to GHCR
3. Build and push `stipt-backend`
4. Build and push `stipt-backoffice`
5. SSH to VPS
6. Pull new images
7. Run `docker compose up -d`
8. Optionally clean unused old images

Deployment behavior on the VPS:

- deployment assets live in a fixed directory, for example `/opt/stipt`
- the VPS already contains:
  - `deploy/docker-compose.yml`
  - a production `.env`
  - any required Traefik ACME storage
- the GitHub Action updates the running stack by pulling the latest images and recreating changed containers

Recommended SSH deployment command shape:

- `docker login ghcr.io`
- `docker compose -f /opt/stipt/docker-compose.yml pull`
- `docker compose -f /opt/stipt/docker-compose.yml up -d`

## Required GitHub Secrets

Define at least these repository secrets:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_SSH_KEY`
- `GHCR_USERNAME`
- `GHCR_TOKEN`

If the deploy workflow writes or syncs files to the server, also allow for:

- `VPS_DEPLOY_PATH`

Do not store application secrets in GitHub Actions if they only need to exist on the VPS.

These production app secrets should live on the VPS in the deployment `.env` file instead:

- database username/password
- `Jwt__SecretKey`
- `Seeder__SeedUserPassword`

Development note:

- for local development, continue using .NET user-secrets for backend secrets as already documented
- do not replace the existing development secret workflow with repository-managed env files unless there is a separate explicit request

## Compose Environment File Requirements

The production deployment should use an env file on the VPS.

Example variables expected in the deploy env file:

- `DOMAIN=stipt.slempers.nl`
- `POSTGRES_DB=stipt_backend`
- `POSTGRES_USER=...`
- `POSTGRES_PASSWORD=...`
- `JWT_SECRET_KEY=...`
- `SEED_USER_PASSWORD=...`
- `GHCR_OWNER=...`

The implementation agent may choose slightly different variable names if they are consistent.

## Non-Goals For This First Version

Do not add these unless needed for the initial implementation:

- Kubernetes
- separate staging and production environments
- blue/green deployment
- canary deployment
- managed database migration tooling outside the application startup path
- full mobile store release pipelines

## Acceptance Criteria

The implementation is complete when all of the following are true:

- a production Docker Compose stack exists under `deploy/`
- Traefik routes `/api` to backend and all other paths to backoffice on `stipt.slempers.nl`
- Traefik automatically provisions and persists SSL certificates
- the backend and backoffice are deployable behind Traefik without exposing their ports directly
- the backend connects to PostgreSQL via Docker networking
- pull requests run:
  - backend build + tests
  - backoffice validation build
  - mobile validation build/checks
- a push to `development` builds and publishes backend/backoffice images to GHCR
- the `development` deploy workflow updates the VPS stack over SSH
- deployment does not require rebuilding source code on the VPS

## Implementation Notes For The Agent

- Prefer small, explicit workflow files over one large conditional workflow.
- Use path filters where practical to reduce unnecessary CI runs.
- Use Docker layer caching in GitHub Actions if it is straightforward.
- Keep secrets out of the repository.
- Avoid changing application code unless required to make containerized deployment work.
- Verify and, if necessary, correct the existing Dockerfiles before wiring them into CI and deployment.
- If backoffice production API configuration needs adjustment, prefer environment-driven configuration over hardcoded domains.

## Recommendation Summary

The recommended first implementation is:

- `deploy/docker-compose.yml` for the VPS stack
- Traefik as reverse proxy with Let's Encrypt
- GHCR as image registry
- GitHub Actions for PR validation and `development` deployment
- image-based deployment to VPS over SSH

This is the simplest setup that is production-oriented without introducing unnecessary infrastructure.
