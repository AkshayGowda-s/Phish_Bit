# 🛡️ Phish-Bit - Phishing Detection Browser Extension

A powerful browser extension that detects and warns about phishing links and suspicious QR codes in real-time using AI-powered analysis.

## ✨ Features

- **Real-time Link Scanning**: Automatically scans all hyperlinks on web pages
- **QR Code Detection**: Identifies and analyzes QR codes embedded in images
- **AI-Powered**: Uses n8n workflows with AI backend for threat verification
- **Visual Warnings**: Displays prominent alerts when phishing is detected
- **Threat History**: Tracks detected threats for review
- **Cross-Browser**: Works on Chrome and Firefox
- **Low Overhead**: Efficient scanning that doesn't slow down your browsing

## 📋 System Requirements

- Browser: Chrome/Chromium (v100+) or Firefox (v100+)
- Backend: n8n instance running with webhook endpoint configured
- Python/Node.js: For running n8n backend (optional, can use cloud)

## 🚀 Installation Guide

### For Chrome/Chromium-based Browsers (Edge, Brave, etc.)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Phish_Bit/extension
   ```

2. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your browser
   - OR: Menu → Settings → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `extension` folder
   - The extension should now appear in your extensions list

5. **Configure Webhook URL**
   - Click the Phish-Bit icon in your toolbar
   - Click ⚙️ Settings
   - Update the "Webhook URL" to point to your n8n instance
   - Save settings

### For Firefox

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Phish_Bit/extension
   ```

2. **Open Firefox Add-ons Manager**
   - Go to `about:debugging#/runtime/this-firefox` in your browser
   - OR: Menu → Add-ons and Themes

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on"
   - Navigate to the `extension` folder
   - Select `manifest.json`
   - The extension should now be active

4. **Configure Settings**
   - Click the Phish-Bit icon in your toolbar
   - Click ⚙️ Settings
   - Update the "Webhook URL" and other preferences
   - Save settings

**Note**: In Firefox, temporary add-ons are loaded only for the current session. For permanent installation, consider using the Developer Edition.

## ⚙️ Backend Setup

### Option 1: n8n Cloud (Easiest)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Create an account and start a new workflow
3. Set up a webhook trigger node
4. Add your phishing detection logic/AI
5. Copy the webhook URL and paste it into Phish-Bit settings

### Option 2: Self-Hosted n8n

1. **Install n8n**
   ```bash
   npm install -g n8n
   n8n
   ```

2. **Create a Workflow**
   - Access n8n at `http://localhost:5678`
   - Create a new workflow
   - Add a webhook trigger node
   - Configure it to listen at: `/webhook/check-url`
   - Add nodes to check URLs against known phishing databases or AI models

3. **Test the Webhook**
   ```bash
   curl -X POST http://localhost:5678/webhook/check-url \
     -H "Content-Type: application/json" \
     -d '{"url": "https://example.com"}'
   ```

   Expected response:
   ```json
   {
     "risk": "Safe",
     "message": "URL appears to be legitimate",
     "confidence": 0.95
   }
   ```

### Webhook Response Format

The webhook should return JSON with this structure:

```json
{
  "risk": "Safe" | "Suspicious" | "Scam",
  "message": "Description of the threat or confirmation",
  "confidence": 0.85,
  "details": {...}
}
```

**Risk Levels**:
- `Safe`: No threat detected
- `Suspicious`: URL has characteristics of phishing
- `Scam`: Confirmed phishing/scam URL

## 🎮 Usage

1. **Browse Normally**: The extension works silently in the background
2. **Check Status**: Click the Phish-Bit icon to view current page status
3. **View Warnings**: Red warning banners appear at the top of pages with threats
4. **Review History**: Check the popup to see recently detected threats
5. **Settings**: Adjust detection sensitivity and webhook configurations

## 🔧 Configuration

### Webhook URL
- Default: `http://localhost:5678/webhook/check-url`
- Change in Settings to point to your n8n instance

### Scanning Parameters
- **Max URLs per page**: 20 (limit for performance)
- **Scan Timeout**: 5000ms (5 seconds)
- Edit these in Settings → Advanced

### Notifications
- Enable/disable desktop notifications for threats
- Enable/disable sound alerts

## 🐛 Troubleshooting

### Extension not scanning links
- Check console for errors (F12 → Console)
- Verify webhook URL is correct in Settings
- Ensure backend is running and accessible

### Backend connection refused
- Verify n8n is running: `curl http://localhost:5678`
- Check firewall allows connection
- Review webhook URL configuration

### Popup shows "Scanning for threats..."
- Wait a few seconds for page scan to complete
- Check browser console for errors
- Verify network connectivity

### QR codes not detected
- Ensure images on page load completely
- Some QR codes may be ignored due to image quality
- Check browser console for cross-origin errors

## 📁 File Structure

```
extension/
├── manifest.json          # Extension configuration
├── content.js             # Page scanning logic
├── popup.html             # Popup UI
├── popup.js               # Popup logic
├── background.js          # Background service worker
├── options.html           # Settings page
├── options.js             # Settings logic
├── jsQR.js                # QR code detection library
└── icons/                 # Extension icons (optional)
```

## 🔐 Privacy & Security

- **Local Processing**: Most scanning happens locally in your browser
- **No Data Collection**: Extension doesn't collect browsing history
- **No Tracking**: No analytics or tracking employed
- **Backend Communication**: Only sends URLs to your configured backend
- **Open Source**: Code is transparent and reviewable

## 📝 API Reference

### Content Script Messages

From `content.js` to background:

```javascript
// Threat detected
chrome.runtime.sendMessage({
  type: "THREAT_DETECTED",
  threat: {
    url: "https://...",
    risk: "Scam",
    message: "Description"
  }
});

// Get current threats
chrome.runtime.sendMessage(
  { type: "GET_THREATS" },
  (response) => console.log(response.threats)
);
```

### Storage

Settings stored in `chrome.storage.local`:
- `phishbit_settings`: User configuration
- `phishbit_threats`: Threat history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Test thoroughly on both Chrome and Firefox
5. Submit a pull request

## 📄 License

This project is provided as-is for educational and security purposes.

## ⚠️ Disclaimer

This extension provides real-time phishing detection based on URL scanning. However:
- No security tool is 100% effective
- Always verify URLs before clicking suspicious links
- Report confirmed phishing to [report@phishing.com](mailto:report@phishing.com) or your browser vendor
- Keep the extension and your browser updated

## 📞 Support

For issues, questions, or suggestions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review browser console for error messages
3. Check n8n backend logs
4. Open an issue in the repository

---

**Phish-Bit**: Protecting users from phishing threats, one click at a time. 🛡️