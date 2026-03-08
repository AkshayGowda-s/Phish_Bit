# 📋 Installation & Deployment Checklist

Use this checklist to verify your Phish-Bit extension is properly installed and configured.

## ✅ Pre-Installation Requirements

- [ ] Browser installed (Chrome/Edge/Brave OR Firefox)
- [ ] Repository cloned/downloaded
- [ ] Text editor or IDE available for editing config
- [ ] (Optional) n8n instance running OR cloud account

## ✅ File Structure Verification

Navigate to `extension/` folder and verify these files exist:

**Core Files:**
- [ ] `manifest.json` ← Extension configuration
- [ ] `content.js` ← Page scanning logic
- [ ] `background.js` ← Background service worker
- [ ] `popup.html` ← Popup interface
- [ ] `popup.js` ← Popup logic
- [ ] `options.html` ← Settings page
- [ ] `options.js` ← Settings logic
- [ ] `jsQR.js` ← QR code library

**Documentation:**
- [ ] `icons/README.md` ← Icon placement guide

## ✅ Extension Installation

### For Chrome/Chromium (Edge, Brave, etc.):

1. [ ] Open `chrome://extensions/` or browser menu → Extensions
2. [ ] Click "Developer mode" toggle (top-right corner)
3. [ ] Click "Load unpacked"
4. [ ] Select the `extension/` folder from this repo
5. [ ] See "Phish-Bit Interceptor" listed with status "Enabled"
6. [ ] Extension icon appears in toolbar

**Verification:**
- [ ] Click extension icon → popup loads
- [ ] Settings button (⚙️) is clickable
- [ ] No errors in console (F12 → Console)

### For Firefox:

1. [ ] Open `about:debugging#/runtime/this-firefox`
2. [ ] Click "Load Temporary Add-on"
3. [ ] Select `extension/manifest.json`
4. [ ] Extension appears in list as "Enabled"
5. [ ] Extension icon appears in toolbar

**Verification:**
- [ ] Click extension icon → popup loads
- [ ] Settings button (⚙️) is clickable
- [ ] No errors in browser console (F12)

## ✅ Backend Setup

### Option A: Test with Localhost n8n

1. [ ] Install n8n: `npm install -g n8n`
2. [ ] Start n8n: `n8n` (or `n8n start`)
3. [ ] Access http://localhost:5678 in browser
4. [ ] Verify n8n loads without errors
5. [ ] Create new workflow or import from `automation/n8n-workflow.json`

**Workflow Setup:**
- [ ] Webhook trigger configured at `/webhook/check-url`
- [ ] URLhaus API node connected
- [ ] Threat analysis function node added
- [ ] Response webhook node configured
- [ ] [ ] Workflow is activated (toggle enabled)

**Testing:**
```bash
curl -X POST http://localhost:5678/webhook/check-url \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'
```
- [ ] Response received (status 200)
- [ ] Returns JSON with `risk`, `message`, `confidence`

### Option B: Use n8n Cloud

1. [ ] Create account at https://n8n.cloud
2. [ ] Create new workflow
3. [ ] Set up webhook trigger and response nodes
4. [ ] Copy webhook URL from trigger node
5. [ ] Workflow is activated

## ✅ Extension Configuration

1. [ ] Click Phish-Bit icon 🛡️ in toolbar
2. [ ] Click "⚙️ Settings" button
3. [ ] Enter webhook URL in "Webhook URL" field
   - Localhost: `http://localhost:5678/webhook/check-url`
   - Cloud: `https://your-instance.n8n.cloud/webhook/check-url`
4. [ ] Adjust if needed:
   - [ ] Max URLs to Scan: 20 (default)
   - [ ] Scan Timeout: 5000ms (default)
   - [ ] Notifications: Enabled/Disabled
   - [ ] Sound Alerts: Enabled/Disabled
5. [ ] Click "💾 Save Settings"
6. [ ] See success message: "✓ Settings saved successfully"

## ✅ Functionality Testing

### Test 1: Extension Loads
1. [ ] Visit any website (e.g., google.com)
2. [ ] Click Phish-Bit icon
3. [ ] Popup shows "✓ Page appears safe" (assuming safe site)
4. [ ] No console errors

### Test 2: Link Scanning
1. [ ] Visit a website with multiple links
2. [ ] Wait 3-5 seconds for scanning to complete
3. [ ] Check extension console (F12 → Console → Phish-Bit messages)
4. [ ] URLs were sent to backend

### Test 3: Threat Detection (if you have a test URL)
1. [ ] If available, visit a known phishing URL in safe environment
2. [ ] Should see red warning banner at top of page
3. [ ] Popup shows "⚠️ Scam Detected"
4. [ ] Banner has dismiss button

### Test 4: QR Code Detection
1. [ ] Visit a page with QR codes (test QR code generators)
2. [ ] Wait for scan
3. [ ] Check if QR URL was extracted and checked

### Test 5: Settings Persistence
1. [ ] Change settings and save
2. [ ] Reload extension (F5 on extension management page)
3. [ ] Click settings again
4. [ ] Previously entered values are still there

## ✅ Cross-Browser Testing

If testing both browsers:

**Chrome/Edge:**
- [ ] Extension loads
- [ ] Popup works
- [ ] Settings save
- [ ] Scanning active

**Firefox:**
- [ ] Extension loads
- [ ] Popup works
- [ ] Settings save
- [ ] Scanning active

## ✅ Troubleshooting Checks

### Extension Not Appearing in Toolbar
- [ ] Check Load unpacked was successful
- [ ] Refresh extension (reload button on manage page)
- [ ] Check browser dev tools for load errors
- [ ] Try incognito/private window

### Settings Not Saving
- [ ] Check browser console for JavaScript errors
- [ ] Verify storage permissions in manifest.json
- [ ] Try clearing browser data and reload extension
- [ ] Check localStorage in dev tools

### Website Scanning Not Working
- [ ] Check webhook URL is correct in settings
- [ ] Verify backend is running: `curl http://localhost:5678`
- [ ] Check content script loaded (F12 → Console should have Phish-Bit messages)
- [ ] Verify host_permissions in manifest include the domain

### Backend Not Responding
- [ ] Confirm n8n is running: `http://localhost:5678`
- [ ] Test webhook manually with curl
- [ ] Check n8n logs for errors
- [ ] Verify webhook path matches: `/webhook/check-url`
- [ ] Check firewall isn't blocking localhost

### Popup Shows "Scanning..." Forever
- [ ] Wait longer (first scan can take 5-10 seconds)
- [ ] Check F12 console for errors
- [ ] Verify webhook URL in settings
- [ ] Try refreshing page
- [ ] Restart extension

## ✅ Security Verification

- [ ] No errors about "unsafe" code in console
- [ ] HTTPS used for all external API calls (if applicable)
- [ ] Settings stored locally (check dev tools Storage)
- [ ] No API keys exposed in code

## ✅ Final Deployment Checklist

### Before Publishing/Sharing:

**Code:**
- [ ] No console.log with sensitive data
- [ ] Error handling for all API calls
- [ ] Webhook URL configurable (not hardcoded for prod)

**Testing:**
- [ ] Tested on Chrome/Chromium
- [ ] Tested on Firefox
- [ ] Settings persist across sessions
- [ ] Scanning works on multiple websites
- [ ] No memory leaks (monitor process)

**Documentation:**
- [ ] README.md complete and accurate
- [ ] QUICKSTART.md ready for users
- [ ] WORKFLOW_SETUP.md for backend setup
- [ ] Troubleshooting section provided

**User Experience:**
- [ ] First-time setup is intuitive
- [ ] Error messages are helpful
- [ ] No unexpected permissions requested
- [ ] Settings are easy to find

## 📝 Verification Report

After completing all checks, document:

**Installation Status:**
- [ ] Browser: _____________ (Chrome/Firefox/etc.)
- [ ] Extension Version: 1.0.1
- [ ] Backend: _____________ (localhost/cloud)
- [ ] Webhook URL: _____________________________

**Functionality:**
- [ ] Scanning: ✓ Working / ✗ Not working
- [ ] Link detection: ✓ Working / ✗ Not working
- [ ] QR detection: ✓ Working / ✗ Not working
- [ ] Popup: ✓ Working / ✗ Not working
- [ ] Settings: ✓ Working / ✗ Not working

**Issues Encountered:**
_________________________________

**Ready for Production:** Yes [ ] No [ ]

---

## 🎉 You're Done!

Your Phish-Bit extension is now ready to protect against phishing! 🛡️

For ongoing support:
1. Keep the extension updated from repository
2. Monitor n8n workflow performance
3. Review threat history periodically
4. Update phishing detection rules as needed

Enjoy secure browsing! 🔒
