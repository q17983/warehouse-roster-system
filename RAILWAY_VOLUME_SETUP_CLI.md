# Railway Volume Setup via CLI (If UI Not Available)

Since you can't find the Volumes section in Railway UI, let's try using Railway CLI.

## Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway

```bash
railway login
```

This will open a browser for authentication.

## Step 3: Link to Your Project

```bash
cd "/Users/sai/Warehouse management"
railway link
```

Select your `warehouse-roster-system` project when prompted.

## Step 4: Create Volume

```bash
railway volumes create data --mount /data
```

This creates a volume named "data" mounted at `/data`.

## Step 5: Set Environment Variable

```bash
railway variables set DATABASE_PATH="/data/roster.db"
```

## Step 6: Verify

```bash
railway variables
```

Should show `DATABASE_PATH=/data/roster.db`.

## Step 7: Redeploy

Railway should automatically redeploy after setting the variable.

---

## Alternative: Check Railway Dashboard Again

Sometimes the Volumes section appears after:
1. Clicking your service
2. Going to Settings tab
3. Scrolling ALL the way down (past Resource Limits, Cron Schedule, etc.)

Look for:
- "Volumes"
- "Storage" 
- "Persistent Storage"
- "Mount Points"

If it's still not there, the CLI method above should work.

