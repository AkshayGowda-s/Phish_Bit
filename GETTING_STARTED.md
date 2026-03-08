# 🛡️ Phish-Bit: Getting Started Guide

Welcome! Your phishing detection browser extension is **ready to use**. Follow this guide to get up and running in minutes.

## ⚡ Express Setup (5 minutes)

### Step 1️⃣: Load Extension into Your Browser

👉 **Choose your browser:**

<details open>
<summary><strong>Chrome, Edge, Brave, or other Chromium browser</strong></summary>

1. Open your browser and go to: **`chrome://extensions/`**
   - Or: Menu → More Tools → Extensions

2. In the top-right corner, toggle **"Developer mode"** ON

3. Click **"Load unpacked"**

4. Navigate to your `Phish_Bit/extension/` folder and select it

5. You should see "Phish-Bit Interceptor" appear with status "Enabled" ✅

6. The extension icon should appear in your toolbar

</details>

<details>
<summary><strong>Firefox</strong></summary>

1. Open Firefox and go to: **`about:debugging#/runtime/this-firefox`**
   - Or: Menu → Add-ons and Themes

2. Click **"Load Temporary Add-on"**

3. Navigate to `Phish_Bit/extension/manifest.json` and select it

4. You should see "Phish-Bit Interceptor" listed as "Enabled" ✅

5. The extension icon should appear in your toolbar

**Note:** In Firefox, temporary add-ons load only for the current session. For permanent installation, use the Developer Edition.

</details>

### Step 2️⃣: Set Up Backend (Choose one)

**Option A: Quick Local Setup (Recommended for testing)**

```bash
npm install -g n8n
n8n
```

This will start n8n at `http://localhost:5678`

**Option B: Use n8n Cloud (No installation needed)**

1. Go to https://n8n.cloud
2. Sign up (free)
3. Create account and login

### Step 3️⃣: Import Workflow

<details>
<summary><strong>For Local n8n</strong></summary>

1. Open http://localhost:5678 in your browser

2. Create a new workflow (or click "+ New")

3. Use Menu → Workflows → Import from URL or file

4. Select `Phish_Bit/automation/n8n-workflow.json`

5. The workflow should load with all nodes connected

6. Click the **Activate** toggle in the top-left (it should show green)

</details>

<details>
<summary><strong>For n8n Cloud</strong></summary>

1. In your n8n dashboard, create new workflow

2. Add a **Webhook** trigger node
   - HTTP Method: POST
   - Path: check-url

3. Add **HTTP Request** node (for URLhaus check)
   - Method: GET
   - URL: https://urlhaus-api.abuse.ch/v1/url/?url={{encodeURIComponent($json.url)}}

4. Add **Function** node - Copy code from workflow template file

5. Add **Respond to Webhook** node at the end

6. Activate workflow

</details>

### Step 4️⃣: Configure Extension

1. **Click the Phish-Bit icon** 🛡️ in your browser toolbar

2. Click **⚙️ Settings** button

3. In the "Webhook URL" field, enter:
   - **Local**: `http://localhost:5678/webhook/check-url`
   - **Cloud**: Your n8n cloud webhook URL (copy from webhook trigger node)

4. Click **💾 Save Settings**

5. You should see: ✅ **"Settings saved successfully"**

### Step 5️⃣: Verify It Works

1. **Test with curl** (in terminal/command prompt):
   ```bash
   curl -X POST http://localhost:5678/webhook/check-url \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```

   You should get a response like:
   ```json
   {
     "url": "https://google.com",
     "risk": "Safe",
     "message": "URL appears to be legitimate",
     "confidence": 0.85
   }
   ```

2. **Test in browser**:
   - Visit any website (e.g., google.com)
   - Click Phish-Bit icon
   - Should show "✓ Page appears safe"
   - Wait 2-3 seconds for scanning to complete

3. **Test scanning**:
   - Reload page (F5)
   - Open browser console (F12)
   - You should see Phish-Bit messages like "QR URL Detected" or "Checking URL..."

**🎉 You're done! The extension is now protecting you!**

---

## 📚 Detailed Documentation

Need more information? Here are all the guides:

| Guide | Time | For |
|-------|------|-----|
| **[QUICKSTART.md](QUICKSTART.md)** | 5 min | Quick setup overview |
| **[README.md](README.md)** | 15 min | Complete documentation |
| **[WORKFLOW_SETUP.md](WORKFLOW_SETUP.md)** | 20 min | Backend configuration details |
| **[INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)** | 10 min | Verification & troubleshooting |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | 10 min | How everything connects |
| **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** | 5 min | What was built & improvements |

---

## 🔧 Troubleshooting Quick Fixes

### Extension not appearing in toolbar?
- Refresh extension (F5 on extensions page)
- Make sure "Load unpacked" was successful
- Check Developer mode is ON (Chrome)

### Settings won't save?
- Check browser console for errors (F12)
- Try in incognito/private mode
- Clear browser cache and reload extension

### Webhook connection refused?
```bash
# Check if n8n is running:
curl http://localhost:5678

# If not, start it:
npm install -g n8n && n8n
```

### Scanner shows "Scanning for threats..." forever?
- Wait 5 seconds (first scan can be slow)
- Check browser console for errors (F12)
- Verify webhook URL is correct in Settings

### Popup doesn't update?
- Click Settings, verify webhook URL
- Reload page (F5)
- Restart browser extension

---

## 🎯 What Happens When You Browse

```
You visit a website
        ↓
Extension automatically scans:
├─ All links on the page
├─ QR codes in images
└─ Watches for new content
        ↓
Suspicious URLs sent to n8n backend
        ↓
Backend checks against threat databases:
├─ URLhaus
├─ Shortener services
├─ HTTP vs HTTPS
└─ Other patterns
        ↓
Extension displays result:
├─ Green banner: "Safe"
├─ Orange banner: "Suspicious"
└─ Red warning: "SCAM DETECTED!"
```

---

## 🎓 Next Learning Steps

1. **Customize Settings**
   - Click extension → ⚙️ Settings
   - Adjust notification preferences
   - Set detection sensitivity

2. **Review Threat History**
   - Click Settings
   - View recently detected threats
   - Clear history if needed

3. **Extend Detection**
   - Add more threat sources to n8n workflow
   - Integrate additional APIs
   - Create custom detection rules

4. **Deploy to Others**
   - Share extension folder
   - Provide webhook URL
   - Include QUICKSTART.md

---

## 📊 Extension Features Overview

✅ **Automatic Scanning**
- Runs silently in background
- No action needed from you
- Works on every website

✅ **Real-time Alerts**
- Red warning banners for threats
- Popup shows current page status
- Badge with threat count

✅ **Customizable**
- Adjust detection sensitivity
- Choose notification style
- Configure backend webhook

✅ **Privacy-Focused**
- Only sends URLs to backend
- No tracking or analytics
- All settings stored locally

✅ **Extensible**
- Add custom threat sources
- Integrate your own API
- Modify detection logic

✅ **Cross-Browser**
- Works on Chrome/Edge/Brave
- Works on Firefox
- Same functionality everywhere

---

## 🚀 Advanced Configuration

After basic setup, you can:

1. **Add More Threat Sources** (in n8n)
   - PhishTank API
   - OpenPhish integration
   - Custom ML models
   - Your own API

2. **Improve Detection** (in n8n)
   - Domain reputation checks
   - Content analysis
   - Machine learning models
   - Crowdsourced databases

3. **Custom Notifications** (in options.html)
   - Custom sound alerts
   - Desktop notifications
   - Slack/Email alerts
   - Webhook to your system

4. **Analytics & Reporting** (add to workflow)
   - Log all checks to database
   - Generate threat reports
   - Track patterns
   - Share insights with team

See [WORKFLOW_SETUP.md](WORKFLOW_SETUP.md) for advanced options.

---

## 💡 Pro Tips

1. **First-time Scan is Slower**
   - Extension creates index on first load
   - Subsequent pages are faster
   - 3-7 seconds typical for first page

2. **Test with Known Safe URLs**
   - google.com, github.com, microsoft.com
   - These should show "Safe"
   - Ensures backend is working

3. **Monitor Console for Debugging**
   - Open F12 → Console tab
   - Search for "Phish-Bit" messages
   - Helps diagnose issues

4. **Check Settings Periodically**
   - Ensure webhook URL is still correct
   - Review threat history
   - Adjust sensitivity if needed

5. **Keep n8n Updated**
   - Run `npm update -g n8n` regularly
   - Updates improve detection
   - New threat sources included

---

## 📞 Getting Help

1. **Check console for errors** (F12)
   - Most issues visible here

2. **Test webhook manually**
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"url":"https://google.com"}'
   ```

3. **Review relevant guide**
   - QUICKSTART.md for setup issues
   - WORKFLOW_SETUP.md for backend issues
   - INSTALLATION_CHECKLIST.md for verification

4. **Check README.md**
   - Comprehensive troubleshooting section
   - Common issues and solutions

---

## ✨ You're All Set!

Your Phish-Bit extension is now:
- ✅ Installed and active
- ✅ Connected to backend
- ✅ Scanning websites
- ✅ Protecting you from phishing

**Enjoy secure browsing! 🔒**

---

**Next:** Review [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) to verify everything is working correctly.

Or jump to [README.md](README.md) for the complete reference.
