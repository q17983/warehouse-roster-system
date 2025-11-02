# 🚨 CRITICAL: Multiple Database Instances Issue

## Problem Identified

The Brain creates 6 staff members, but `/api/staff` returns an empty array `[]`.

**This proves different API routes are seeing different database states.**

## Root Cause

Next.js in production mode may create separate instances of modules for different API routes, causing each route to open its own SQLite database connection. Since SQLite file locks aren't working as expected in the containerized environment, each connection might be getting isolated views of the data.

## Evidence

```
[Brain] Total staff in database after sync: 6
[Brain] Staff list: 1:ACAC, 4:AJ, 3:JT, 2:KC, 5:Sohaib, 6:譚鎮邦

BUT

GET /api/staff → {"success":true,"staff":[]}
```

## Solution

Ensure a SINGLE global database instance is shared across all API routes in the Next.js serverless environment.

---

## Deploying Fix Now...

