# 🔄 How to Restore Stable Version

If you make changes and want to restore the working v1.0 version:

## Quick Restore

### Method 1: Restore via Git Tag (Recommended)

```bash
cd "/Users/sai/Warehouse management"

# See all tags
git tag

# Restore to v1.0-stable
git checkout v1.0-stable

# Create new branch (optional, to preserve current work)
git checkout -b backup-$(date +%Y%m%d)
git push origin backup-$(date +%Y%m%d)

# Restore main branch to stable
git checkout main
git reset --hard v1.0-stable
git push origin main
```

### Method 2: Restore via Commit Hash

```bash
cd "/Users/sai/Warehouse management"

# Restore to commit 5616d5d
git reset --hard 5616d5d
git push -f origin main
```

---

## What v1.0-stable Includes

✅ PostgreSQL database integration
✅ All core features working
✅ Mobile-optimized leader interface
✅ Data persistence guaranteed
✅ Clean, simple codebase

**Commit:** 5616d5d
**Tag:** v1.0-stable
**Date:** November 2, 2025

---

## Before Making Changes

Always create a backup branch:

```bash
git checkout -b feature-name
# Make your changes
git add -A
git commit -m "Description"
git push origin feature-name
```

If it works → merge to main
If it breaks → restore from v1.0-stable

---

## Railway Deployment

After restoring:
1. Railway will auto-deploy the restored version
2. Wait 3 minutes
3. Your working system is back!

**The stable version is safely tagged and can always be restored!** ✅

