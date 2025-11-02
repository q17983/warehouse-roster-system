# Cron Job Examples for Automatic Sync

If you're using an external cron service or server-side cron, here are examples:

## Sync Endpoint

```
GET or POST: https://your-app-url/api/sync
```

No authentication required - uses environment variables from your server.

---

## Cron Schedule Examples

### Every Hour (Recommended)
```
0 * * * *
```

### Every 30 Minutes
```
*/30 * * * *
```

### Every 2 Hours
```
0 */2 * * *
```

### Every Day at 8 AM
```
0 8 * * *
```

### Every Hour During Business Hours (8 AM - 8 PM)
```
0 8-20 * * *
```

---

## cURL Command (for testing)

Test your sync endpoint manually:

```bash
curl https://your-app-url/api/sync
```

Or with verbose output:

```bash
curl -v https://your-app-url/api/sync
```

---

## Example Response

Success:
```json
{
  "success": true,
  "message": "Data synced successfully",
  "stats": {
    "staffCount": 6,
    "availabilityCount": 45
  },
  "timestamp": "2025-11-02T07:45:04.808Z"
}
```

Error:
```json
{
  "success": false,
  "message": "No data source configured..."
}
```

