# 🔑 Get Railway API Token (Step-by-Step)

## Why You Need This

Railway's browser login doesn't work in the terminal, so you need an API token to create the persistent volume via CLI.

---

## Step-by-Step Instructions

### Step 1: Open Railway Dashboard
Go to: https://railway.app

### Step 2: Click Your Profile
- Look at the **top-right corner**
- Click your **profile picture** or **avatar**

### Step 3: Go to Settings
Click one of these (depending on Railway's UI):
- **"Account Settings"**
- **"Settings"**
- **"Team Settings"**

### Step 4: Find Tokens Section
Look for one of these tabs/sections:
- **"Tokens"**
- **"API Tokens"**
- **"Developer"**
- **"API Keys"**

### Step 5: Create New Token
Click:
- **"Create New Token"** or
- **"New Token"** or
- **"Generate Token"**

### Step 6: Name Your Token
- Give it a name: `CLI Access` or `Volume Setup`
- Click **"Create"** or **"Generate"**

### Step 7: COPY THE TOKEN IMMEDIATELY
- The token will be shown ONCE
- Click **"Copy"** button
- Or manually select and copy the entire token
- **Important:** You can't see it again after closing!

**The token looks like:**
```
abcd1234-5678-90ef-ghij-klmnopqrstuv
```

---

## Next: Create the Volume

After copying the token, open your Terminal and run:

```bash
cd "/Users/sai/Warehouse management"

# Paste your token here (replace the text after the =)
export RAILWAY_TOKEN="paste_your_copied_token_here"

# Login
npx @railway/cli login --browserless $RAILWAY_TOKEN

# Link to project
npx @railway/cli link

# When it asks "Select a project", choose: warehouse-roster-system

# Create volume
npx @railway/cli volume add --mount-path /data

# When it asks for name, type: data

# Verify it worked
npx @railway/cli volume list
```

---

## What to Expect

After running the commands:

1. **Link step:** You'll see your projects listed
   - Use arrow keys to select `warehouse-roster-system`
   - Press Enter

2. **Volume add:** It will ask for a volume name
   - Type: `data`
   - Press Enter

3. **Volume list:** Should show:
   ```
   data    /data    10 GB    ...
   ```

---

## If You Get Stuck

### Can't find Tokens section?
- Try clicking your profile again
- Look for "Developer Settings"
- Or search Railway docs for "API tokens"

### Token doesn't work?
- Make sure you copied the entire token
- No spaces before or after
- Try creating a new token

### CLI commands fail?
- Make sure you're in the project directory
- Check that the token is set: `echo $RAILWAY_TOKEN`
- Try running commands one by one

---

## After Volume Is Created

1. Wait 2-3 minutes for Railway to redeploy
2. Go to Admin Panel and process data
3. Assign staff to dates
4. Check `/api/debug/db` - should show data!
5. "Check Staff" should now work!

