# 📁 Phish-Bit Project Structure

```
Phish_Bit/
│
├── README.md                      ← START HERE: Complete documentation
├── BUILD_SUMMARY.md               ← What was built and improvements
├── QUICKSTART.md                  ← 5-minute setup guide ⚡
├── INSTALLATION_CHECKLIST.md      ← Verification checklist 
├── WORKFLOW_SETUP.md              ← n8n backend configuration
│
├── extension/                     ← MAIN: Browser extension files
│   ├── manifest.json              ← Extension configuration (MV3)
│   ├── content.js                 ← Page scanning logic
│   ├── background.js              ← Background service worker
│   ├── popup.html                 ← Popup interface
│   ├── popup.js                   ← Popup logic
│   ├── options.html               ← Settings page
│   ├── options.js                 ← Settings logic
│   ├── jsQR.js                    ← QR code detection library
│   ├── icons/
│   │   └── README.md              ← Icon creation guide
│   └── [icon files to add]        ← 16px, 48px, 128px PNGs
│
└── automation/                    ← Backend configuration
    └── n8n-workflow.json          ← n8n workflow template
```

## 🎯 Quick Navigation

### For Users
1. **First Time Setup**: [QUICKSTART.md](../QUICKSTART.md) - 5 minutes
2. **Detailed Install**: [README.md](../README.md) - Full guide
3. **Verify Setup**: [INSTALLATION_CHECKLIST.md](../INSTALLATION_CHECKLIST.md)

### For Developers
1. **What Changed**: [BUILD_SUMMARY.md](../BUILD_SUMMARY.md)
2. **Backend Guide**: [WORKFLOW_SETUP.md](../WORKFLOW_SETUP.md)
3. **Source Code**: `extension/` folder

### For DevOps
1. **Workflow Setup**: [WORKFLOW_SETUP.md](../WORKFLOW_SETUP.md)
2. **Webhook Config**: See n8n-workflow.json template
3. **Deployment**: Instructions in README.md

## 📦 Extension Files Explained

| File | Purpose | Size |
|------|---------|------|
| `manifest.json` | Browser extension configuration | 1 KB |
| `content.js` | Runs on every page, scans links & QR | 8 KB |
| `background.js` | Handles messaging & storage | 2 KB |
| `popup.html` | Popup user interface | 3 KB |
| `popup.js` | Popup logic & messaging | 2 KB |
| `options.html` | Settings page interface | 5 KB |
| `options.js` | Settings logic & storage | 2 KB |
| `jsQR.js` | QR code detection library | ~50 KB |

**Total Size**: ~73 KB (mostly jsQR library)

## 🔄 How Components Connect

```
┌─────────────────────────────────────────────────┐
│ manifest.json (Configuration)                   │
└─────────────────────────────────────────────────┘
                       ↓
        ┌──────────────────────────────────────┐
        │                                      │
    ┌─────────┐                    ┌──────────────┐
    │ Browser │                    │  Options Page │
    │ Pages   │                    │ (Settings)   │
    └────┬────┘                    └──────┬───────┘
         │                                │
    ┌────▼──────────┐          ┌─────────▼────┐
    │ content.js    │          │ options.js   │
    │ (Scanning)    │          │ (Config)     │
    └────┬──────────┘          └─────────┬────┘
         │                              │
    ┌────▼──────────────────────────────▼────┐
    │  background.js                         │
    │  (Message Hub & Storage)               │
    └────┬──────────────────────────────────┬┘
         │                                  │
    ┌────▼──────────────┐      ┌───────────▼────┐
    │ popup.js          │      │  n8n Webhook   │
    │ (Displays results)│      │  (Backend AI)  │
    └───────────────────┘      └────────────────┘
```

## 🚀 Installation Paths

### Path A: Chrome/Edge/Brave (Easiest)
```
1. extension/ folder
2. chrome://extensions/
3. Developer mode → Load unpacked
4. Done in 2 minutes!
```

### Path B: Firefox
```
1. extension/ folder
2. about:debugging
3. Load Temporary Add-on
4. Done in 2 minutes!
```

### Path C: Cloud Deployment
```
1. extension/ folder anywhere
2. Configure webhook to cloud n8n
3. Deploy in any environment
```

## 🔌 Data Flow During Scanning

```
Website Page Load
       ↓
content.js runs automatically
       ↓
├─ Scans all <a> links
├─ Detects QR codes in images
└─ Watches for new content (mutation observer)
       ↓
Sends suspicious URLs to webhook
       ↓
n8n Workflow processes:
├─ Checks URLhaus database
├─ Analyzes threat patterns
└─ Returns risk level (Safe/Suspicious/Scam)
       ↓
background.js receives result
       ↓
├─ Show popup alert
├─ Display warning banner on page
├─ Update extension badge
└─ Store in threat history
```

## 💾 Storage Architecture

```
Browser's Local Storage
├── phishbit_settings (JSON)
│   ├── webhookUrl
│   ├── enableNotifications
│   ├── enableSound
│   ├── maxUrls
│   └── scanTimeout
│
└── phishbit_threats (Array)
    ├── [0] Recent threat
    ├── [1] Previous threat
    └── ... (max 100 stored)
```

## 🎨 UI Architecture

```
Popup Interface
├─ Header with logo
├─ Status display
│  ├─ ✓ Safe (green)
│  ├─ ⚠ Suspicious (orange)
│  └─ ✗ Scam (red)
├─ Warning box (if threat detected)
├─ Info section
└─ Buttons
   ├─ Scan Page
   └─ Settings

Settings Page
├─ Checkboxes
   ├─ Enable Notifications
   └─ Enable Sound
├─ Text inputs
   ├─ Webhook URL
   ├─ Max URLs
   └─ Scan Timeout
├─ Buttons
   ├─ Save
   ├─ Reset
   └─ Clear History
```

## 📊 Configuration Layers

```
1. Default Settings (hardcoded in code)
   ↓
2. User Settings (saved in storage)
   ↓
3. Runtime Config (from n8n workflow)
   ↓
4. Per-Page Behavior (content.js execution)
```

## 🔐 Permission Model

```
permission: activeTab
  → Allows popup to know current tab

permission: scripting
  → Allows content.js to run on pages

permission: storage
  → Allows saving settings/history

permission: webRequest
  → For future web request interception

host_permissions: <all_urls>
  → Allows scanning all websites
```

## 📈 Performance Characteristics

| Operation | Time | Instances |
|-----------|------|-----------|
| Load extension | <100ms | Once per session |
| Page scan start | 100-500ms | Per page load |
| Link scan all | 500-2000ms | Per page |
| QR detection per image | 50-200ms | Per image |
| Webhook request | 500-5000ms | Per URL |
| UI update | <50ms | Per response |

**Total per page**: 1-7 seconds (depending on complexity)

## 🧪 Testing Checklist Quick Reference

```
✓ Extension loads
✓ Popup displays
✓ Settings persist
✓ Links are scanned
✓ QR codes detected
✓ Warnings display
✓ Webhook responds
✓ Storage works
✓ No console errors
✓ Works offline (gracefully)
```

## 🎯 Main Use Cases

1. **User browsing web**
   → content.js automatically scans
   → Popup shows status
   → Warnings appear if threats found

2. **User changes settings**
   → options.js saves configuration
   → background.js applies changes
   → Behavior updated for future pages

3. **Admin reviewing threats**
   → Click Phish-Bit icon
   → View threat history
   → Make settings adjustments

4. **Security team deploying**
   → Distribute extension
   → Configure webhook URL
   → Monitor threat patterns

## 📞 Key Files for Modifications

| Need to Change | Edit File |
|---|---|
| Scanning rules | content.js |
| UI appearance | popup.html, options.html |
| Threat analysis | n8n-workflow.json |
| Default settings | content.js (CONFIG) |
| Permissions | manifest.json |
| Backend URL | options.js (UI) or popup.js |

---

**Ready to get started?** → Begin with [QUICKSTART.md](../QUICKSTART.md)

For the complete guide → [README.md](../README.md)

For detailed verification → [INSTALLATION_CHECKLIST.md](../INSTALLATION_CHECKLIST.md)
