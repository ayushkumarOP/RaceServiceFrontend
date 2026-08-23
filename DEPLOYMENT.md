# RaceService Frontend - Deployment Guide

This guide covers how to set up and deploy the RaceService frontend to Google Cloud Platform App Engine.

---

## Table of Contents

1. Prerequisites
2. GCP Setup (One-time)
3. GitHub Secrets Configuration
4. CI/CD Workflow
5. Manual Deployment
6. Troubleshooting

---

## Prerequisites

### Install Google Cloud SDK

**Windows (PowerShell as Administrator):**
```powershell
# Download and run the installer
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

Or download manually from: https://cloud.google.com/sdk/docs/install

**macOS:**
```bash
brew install --cask google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Verify Installation
```bash
gcloud --version
```

---

## GCP Setup (One-time)

### Step 1: Authenticate with GCP

```bash
gcloud auth login
```

This opens a browser window for authentication.

### Step 2: Set Your Project

```bash
# List your projects
gcloud projects list

# Set the active project
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Enable Required APIs

```bash
gcloud services enable appengine.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 4: Initialize App Engine (if not already done)

```bash
# Choose a region (e.g., us-central, europe-west1, asia-east1)
gcloud app create --region=YOUR_REGION
```

### Step 5: Create Service Account for CI/CD

```bash
# Replace YOUR_PROJECT_ID with your actual project ID

# Create the service account
gcloud iam service-accounts create github-actions-deployer \
    --display-name="GitHub Actions Deployer"

# Grant App Engine Admin role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/appengine.appAdmin"

# Grant Storage Admin role (needed for uploading files)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Grant Cloud Build Editor role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

# Grant Service Account User role
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### Step 6: Generate Service Account Key

```bash
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

⚠️ **IMPORTANT**: Keep `key.json` secure! Never commit it to version control.

---

## GitHub Secrets Configuration

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `GCP_PROJECT_ID` | Your GCP project ID (e.g., `my-raceservice-project`) |
| `GCP_SA_KEY` | Entire contents of `key.json` file |

### How to copy the key.json contents:

**Windows (PowerShell):**
```powershell
Get-Content key.json | Set-Clipboard
```

**macOS/Linux:**
```bash
cat key.json | pbcopy  # macOS
cat key.json | xclip   # Linux
```

Then paste into the `GCP_SA_KEY` secret value field.

---

## CI/CD Workflow

### Automatic Deployments

| Branch | Environment | Service Name | URL |
|--------|-------------|--------------|-----|
| `main` | Production | `raceservice-frontend` | `https://raceservice-frontend-dot-PROJECT_ID.appspot.com` |
| Any other branch | Development | `raceservice-frontend-dev` | `https://raceservice-frontend-dev-dot-PROJECT_ID.appspot.com` |

### Workflow Files

- **Production**: `.github/workflows/deploy-prod.yml`
- **Development**: `.github/workflows/deploy-dev.yml`

### Triggering Deployments

- **Dev**: Push to any branch except `main`
- **Prod**: Push or merge to `main`

Check deployment status in GitHub → Actions tab.

---

## Manual Deployment

If you need to deploy manually from your local machine:

### Step 1: Install Dependencies & Build

```bash
npm install
npm run build
```

### Step 2: Deploy

**To Development:**
```bash
gcloud app deploy app-dev.yaml --project=YOUR_PROJECT_ID
```

**To Production:**
```bash
gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
```

### Step 3: View Your App

```bash
gcloud app browse --project=YOUR_PROJECT_ID
```

---

## Troubleshooting

### Common Issues

#### 1. "App Engine application does not exist"
```bash
gcloud app create --region=YOUR_REGION
```

#### 2. "Permission denied" errors
Ensure your service account has all required roles:
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:github-actions-deployer@"
```

#### 3. "Cloud Build API has not been used"
```bash
gcloud services enable cloudbuild.googleapis.com
```

#### 4. Build fails in GitHub Actions
- Check that `GCP_PROJECT_ID` and `GCP_SA_KEY` secrets are set correctly
- Verify the service account key hasn't expired
- Check the Actions logs for specific error messages

#### 5. 404 errors after deployment
- Ensure `npm run build` completed successfully
- Check that `dist/` folder contains `index.html` and `assets/`

### Viewing Logs

```bash
# Stream logs
gcloud app logs tail --project=YOUR_PROJECT_ID

# View recent logs
gcloud app logs read --project=YOUR_PROJECT_ID --limit=50
```

### Checking Deployed Versions

```bash
gcloud app versions list --project=YOUR_PROJECT_ID
```

### Rolling Back

```bash
# List versions
gcloud app versions list --service=raceservice-frontend --project=YOUR_PROJECT_ID

# Route traffic to a specific version
gcloud app services set-traffic raceservice-frontend \
    --splits=VERSION_ID=1 \
    --project=YOUR_PROJECT_ID
```

---

## Environment Variables

To add environment variables for your backend API:

1. Edit `app.yaml` (production) or `app-dev.yaml` (development)
2. Add under `env_variables`:
   ```yaml
   env_variables:
     NODE_ENV: "production"
     VITE_API_URL: "https://your-backend-api.com"
   ```

3. Access in React code:
   ```typescript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

**Note**: For Vite, environment variables must be prefixed with `VITE_` to be exposed to the client.

---

## Useful Commands Quick Reference

```bash
# Auth
gcloud auth login
gcloud auth list

# Project
gcloud config set project PROJECT_ID
gcloud config get-value project

# Deploy
gcloud app deploy app.yaml
gcloud app deploy app-dev.yaml

# View
gcloud app browse
gcloud app logs tail

# Services
gcloud app services list
gcloud app versions list
```

---

## Support

For GCP-specific issues: https://cloud.google.com/support
For App Engine documentation: https://cloud.google.com/appengine/docs
