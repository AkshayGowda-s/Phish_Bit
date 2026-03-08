# n8n Workflow Setup Guide

This guide explains how to set up the Phish-Bit n8n workflow for phishing detection.

## Option 1: Import Pre-built Workflow (Easiest)

1. **Open n8n** at http://localhost:5678 (or your cloud instance)

2. **Import Workflow**
   - Click "+ New" → "Import from URL"
   - Use the workflow file: `n8n-workflow.json`
   - Click "Import"

3. **Activate Workflow**
   - Click the toggle in top-left to activate
   - You should see: "Workflow is now active"

4. **Test the Webhook**
   ```bash
   curl -X POST http://localhost:5678/webhook/check-url \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```

## Option 2: Build Workflow Manually

### Step 1: Create Webhook Trigger
1. Click "+" to add node
2. Search for "Webhook"
3. Configure:
   - **HTTP Method**: POST
   - **Path**: check-url
   - **Authentication**: None
   - Save

### Step 2: Add URLhaus API Check
1. Add "HTTP Request" node
2. Configure:
   - **Method**: GET
   - **URL**: `https://urlhaus-api.abuse.ch/v1/url/?url={{encodeURIComponent($json.url)}}`
   - **Authentication**: None
   - Save

### Step 3: Add Threat Analysis
1. Add "Function" (JavaScript) node
2. Copy code from workflow template
3. This checks multiple threat sources:
   - URLhaus database
   - Shortener services
   - HTTP vs HTTPS
   - Other patterns

### Step 4: Return Response
1. Add "Respond to Webhook" node
2. Connect from "Analyze Threat" node
3. Response will auto-format JSON

### Step 5: Activate & Deploy
1. Click toggle to activate workflow
2. Webhook is now live!

## Advanced: Extend the Workflow

### Add Google Safe Browsing Check
```javascript
// Add to Analyze Threat function
const googleSafeBrowsingUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=YOUR_API_KEY';

// Check Google database for additional accuracy
```

### Add Phishing Database Integration
```javascript
// Add node to check against phishing databases
- PhishTank API: https://phishtank.com/
- OpenPhish: https://www.openphish.com/
```

### Add ML/AI Classification
Integrate with:
- ChatGPT API for content analysis
- Custom ML model for URL classification
- Suspicious domain reputation services

### Webhook Response Storing
```javascript
// Add database node to store all checks
// Track patterns and improve detection
```

## Testing Different Scenarios

### Test Safe URL:
```bash
curl -X POST http://localhost:5678/webhook/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com"}'
```
**Expected**: `{"risk":"Safe",...}`

### Test Suspicious URL (shortener):
```bash
curl -X POST http://localhost:5678/webhook/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"http://bit.ly/test123"}'
```
**Expected**: `{"risk":"Suspicious",...}`

### Test Malicious URL:
```bash
curl -X POST http://localhost:5678/webhook/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"http://example-phishing-site.com"}'
```
**Expected**: `{"risk":"Scam",...}` (if in URLhaus)

## Troubleshooting

### Webhook returns 404
- Check path matches: `/webhook/check-url`
- Ensure workflow is activated
- Check n8n status: `http://localhost:5678`

### URLhaus API timeout
- URLhaus may be slow or down
- Add timeout node with fallback
- Use internal phishing database

### Extension not receiving response
- Check webhook URL in extension settings
- Verify CORS if cross-origin
- Test with curl first (above)

## Production Deployment

For production use:

1. **Enable Authentication**
   - Add basic auth or API key to webhook
   - Update extension settings with credentials

2. **Add Error Handling**
   - Retry logic for failed checks
   - Fallback safe response on timeout
   - Logging for debugging

3. **Monitor Performance**
   - Track response times
   - Alert on failures
   - Monitor API quota usage

4. **Scale the Workflow**
   - Cache frequent URLs
   - Batch process URLs
   - Use dedicated database

5. **Security**
   - Never log sensitive data
   - Validate all inputs
   - Use HTTPS for webhooks
   - Rate limit requests

## API Response Format

The webhook will return:

```json
{
  "url": "https://example.com",
  "risk": "Safe|Suspicious|Scam",
  "message": "User-friendly description",
  "confidence": 0.85,
  "timestamp": "2026-03-08T10:00:00Z",
  "details": {
    "inURLhaus": false,
    "urlhausData": null
  }
}
```

## Support

For n8n help:
- Docs: https://docs.n8n.io
- Community: https://community.n8n.io
- Issues: https://github.com/n8n-io/n8n

For Phish-Bit integration help:
- Check extension console (F12)
- Review n8n workflow logs
- Verify webhook connectivity

---

Once your workflow is running, configure it in Phish-Bit settings! 🛡️
