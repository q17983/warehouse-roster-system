#!/bin/bash
# Railway Volume Setup Script
# Run this script to set up persistent storage for your Railway deployment

set -e

echo "🚀 Railway Volume Setup"
echo "======================="
echo ""

# Check if Railway CLI is available
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli || {
        echo "⚠️  Global install failed. Using npx instead..."
        echo "   (You may need to enter 'npx @railway/cli' before each command below)"
    }
fi

echo ""
echo "Step 1: Login to Railway"
echo "-------------------------"
echo "This will open your browser for authentication..."
railway login || npx @railway/cli login

echo ""
echo "Step 2: Link to your project"
echo "-----------------------------"
echo "Select 'warehouse-roster-system' when prompted..."
cd "/Users/sai/Warehouse management"
railway link || npx @railway/cli link

echo ""
echo "Step 3: Create persistent volume"
echo "---------------------------------"
echo "Creating volume 'data' mounted at /data..."
railway volumes create data --mount /data || npx @railway/cli volumes create data --mount /data

echo ""
echo "Step 4: Set DATABASE_PATH environment variable"
echo "-----------------------------------------------"
railway variables set DATABASE_PATH="/data/roster.db" || npx @railway/cli variables set DATABASE_PATH="/data/roster.db"

echo ""
echo "Step 5: Verify setup"
echo "--------------------"
railway variables || npx @railway/cli variables

echo ""
echo "✅ Setup complete!"
echo ""
echo "Railway will automatically redeploy. Wait 2-3 minutes, then:"
echo "1. Check Railway logs for: [Database] Initializing database at: /data/roster.db"
echo "2. Process your data in Admin Panel"
echo "3. Assign staff and test 'Check Staff' - it should work now!"

