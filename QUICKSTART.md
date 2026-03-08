# 🚀 Quick Start Guide - Phish-Bit

Get Phish-Bit running in 5 minutes!

## Step 1: Load Extension (2 min)

### Chrome/Edge/Brave:
1. Download/clone this repository
2. Go to `chrome://extensions/`
3. Toggle "Developer mode" (top-right)
4. Click "Load unpacked" → select `extension` folder
5. Done! ✓

### Firefox:
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `extension/manifest.json`
4. Done! ✓

## Step 2: Set Up Backend (2 min)

### Quick Test (localhost):
```bash
npm install -g n8n
n8n start
```

Access at: http://localhost:5678

### Using n8n Cloud:
1. Go to https://n8n.cloud
2. Sign up free
3. Create new workflow
4. Add webhook trigger
5. Copy webhook URL

## Step 3: Configure Extension (1 min)

1. Click Phish-Bit icon 🛡️
2. Click ⚙️ Settings
3. Paste webhook URL
4. Click 💾 Save
5. Done! ✓

## Step 4: Create Simple Webhook Workflow (n8n)

### Basic Workflow:
1. Trigger: Webhook (POST /webhook/check-url)
2. Add "HTTP Request" node
3. Config: GET request to `https://urlhaus-api.abuse.ch/v1/url/?url=${$node.Webhook.json.url}`
4. Add "Function" node with:
```javascript
return [
  {
    risk: msg.is_malware ? "Scam" : "Safe",
    message: msg.is_malware ? "URL found in abuse database" : "URL looks legitimate",
    confidence: 0.85
  }
];
```
5. Connect to Response
6. Deploy!

## Testing

### Manual Test:
```bash
curl -X POST http://localhost:5678/webhook/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```

Should return:
```json
{"risk":"Safe","message":"...","confidence":0.85}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| 404 webhook error | Check status at `http://localhost:5678` |
| Extension not scanning | Reload page or refresh extension |
| Popup shows "Scanning..." | Wait 5 seconds or check console (F12) |

## Next Steps

- ✓ Extension loaded
- ✓ Backend configured
- ✓ Webhook deployed

Now test it by visiting suspicious URLs!

---

Need help? See full README.md for detailed setup instructions.
