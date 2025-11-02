# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `warehouse-roster-system` (or any name you like)
   - **Description:** "Staff roster planning system for warehouse management"
   - **Visibility:** Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have files)
3. Click **"Create repository"**

## Step 2: Copy Your Repository URL

After creating the repo, GitHub will show you a URL like:
- `https://github.com/YOUR_USERNAME/warehouse-roster-system.git`

**Copy this URL!**

## Step 3: Connect and Push

Run these commands in your terminal (from your project folder):

```bash
cd "/Users/sai/Warehouse management"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with your repository name

## Done! ✅

Your code is now on GitHub and ready to deploy to Railway!

---

## Alternative: If you use SSH

If you prefer SSH (and have SSH keys set up):

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

