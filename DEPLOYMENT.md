# RaceService Frontend Deployment Guide

The frontend is deployed as a Docker container to Google Cloud Run through GitHub Actions.

## Deployment environments

| Branch | Environment | Cloud Run service | Gateway variable |
| --- | --- | --- | --- |
| `main` | Production | `${CLOUD_RUN_SERVICE}` | `VITE_GATEWAY_URL` |
| `dev` | Development | `${CLOUD_RUN_SERVICE}-dev` | `VITE_GATEWAY_URL_DEV` |

Both services are public. A successful deployment makes a `GET /health` request to the deployed service and expects HTTP 200.

Feature branches do not update the persistent development service. The `PR Preview Deploy` workflow can be run manually to create a separate preview service named `${CLOUD_RUN_SERVICE}-pr-<PR_NUMBER>`.

## GitHub configuration

In GitHub, open **Settings → Secrets and variables → Actions** and configure the following repository values.

### Secret

| Name | Purpose |
| --- | --- |
| `GCP_SA_KEY` | JSON key for the GitHub Actions deployment service account. |

### Variables

| Name | Purpose |
| --- | --- |
| `GCP_PROJECT_ID` | Google Cloud project containing the Cloud Run services. |
| `GCP_REGION` | Cloud Run and Artifact Registry region. |
| `ARTIFACT_REGISTRY_REPOSITORY` | Docker Artifact Registry repository name. |
| `CLOUD_RUN_SERVICE` | Base Cloud Run service name; development appends `-dev`. |
| `CLOUD_RUN_RUNTIME_SERVICE_ACCOUNT` | Runtime service account supplied to Cloud Run. |
| `VITE_GATEWAY_URL` | Public production gateway URL baked into the production frontend bundle. |
| `VITE_GATEWAY_URL_DEV` | Public development gateway URL baked into the development frontend bundle. |

The deployment identity needs permission to push images to Artifact Registry and deploy Cloud Run services. The runtime service account must be usable by that identity.

## Deployment workflows

- `.github/workflows/deploy-prod.yaml` deploys production when changes are pushed to `main`.
- `.github/workflows/deploy-dev.yaml` deploys the persistent development service when changes are pushed to `dev`.
- `.github/workflows/pr-validation.yaml` validates pull requests targeting `main`.
- `.github/workflows/pr-preview-deploy.yaml` deploys a PR preview when manually dispatched with a pull request number.

Push to `dev` after setting `VITE_GATEWAY_URL_DEV` to create or update the development environment. The workflow logs the resolved Cloud Run URL in its **Get development URL** step. You can also retrieve it locally:

```bash
gcloud run services describe "${CLOUD_RUN_SERVICE}-dev" \
  --project YOUR_PROJECT_ID \
  --region YOUR_REGION \
  --format='value(status.url)'
```

## Manual operations

Build the frontend locally with the development gateway:

```bash
VITE_GATEWAY_URL=https://your-dev-gateway.example npm run build
```

View recent development service logs:

```bash
gcloud run services logs read "${CLOUD_RUN_SERVICE}-dev" \
  --project YOUR_PROJECT_ID \
  --region YOUR_REGION
```

## Legacy App Engine configuration

`app.yaml` and `app-dev.yaml` are retained as legacy App Engine configuration files. They are not used by the current GitHub Actions or Cloud Run deployment pipeline.
