# Cloudflare + GitHub Preview Deployment Playbook

## Target Workflow

Codex creates code changes.

GitHub stores the branch and pull request.

Cloudflare Pages automatically builds the PR branch.

Cloudflare returns a preview URL for review.

When the PR is merged, Cloudflare deploys production.

## Recommended Setup

Use Cloudflare Pages for the first Beeooking web app preview workflow.

Cloudflare Pages supports GitHub integration, automatic deployments, and preview deployments for pull requests.

## Setup Steps

### 1. Create Or Choose A GitHub Repo

Create a GitHub repository for the app.

Recommended branch setup:

- `main`: production branch.
- Feature branches: created by Codex or developers.
- Pull requests: trigger preview deployments.

### 2. Connect Cloudflare Pages To GitHub

In Cloudflare:

1. Go to `Workers & Pages`.
2. Select `Create application`.
3. Choose `Pages`.
4. Choose `Connect to Git`.
5. Authorize the Cloudflare GitHub app.
6. Select the GitHub repo.

### 3. Configure Build Settings

Common build settings:

- React/Vite:
  - Build command: `npm run build`
  - Output directory: `dist`

- Next.js:
  - Build command: `npm run build`
  - Output directory depends on Cloudflare adapter setup.

- Static HTML:
  - Build command: leave blank or use the project command.
  - Output directory: project folder or generated output folder.

### 4. Enable Preview Deployments

Cloudflare Pages can create preview URLs for pull requests and non-production branches.

Recommended:

- Production branch: `main`
- Preview deployments: enabled for pull requests / non-production branches
- Production deployments: only from `main`

### 5. Add Environment Variables

Configure environment variables separately for:

- Production
- Preview

Important:

- Do not point previews at production databases unless intentionally designed.
- Use separate preview/staging API keys and database connections where possible.

### 6. Review Pull Requests

Expected PR flow:

1. Codex creates a branch.
2. Codex opens or updates a GitHub PR.
3. Cloudflare builds the branch.
4. GitHub shows deployment/check status.
5. Reviewer opens the Cloudflare preview URL.
6. Reviewer approves or requests changes.
7. PR merges into `main`.
8. Cloudflare deploys production.

## Recommended Guardrails

- Keep production deploys limited to `main`.
- Require PR review before merging.
- Use separate preview environment variables.
- Add branch protection in GitHub.
- Keep secrets in Cloudflare/GitHub secret stores, not in code.
- Add automated tests before deploy if the app becomes production-critical.

## Useful Cloudflare Features

- GitHub integration.
- Preview deployments.
- Branch deployment controls.
- Environment variables.
- Deployment history.
- Custom domains.
- Web Analytics.

