// Phish-Bit: Member 1 - Interceptor Script
console.log("Phish-Bit: Interceptor Active. Scanning for threats...");

// Configuration - will be loaded from storage
const CONFIG = {
    WEBHOOK_URL: "http://localhost:5678/webhook/check-url",
    MAX_URLS_PER_SCAN: 20,
    SCAN_TIMEOUT: 5000
};

// Load settings from storage
chrome.storage.local.get(['phishbit_settings'], (data) => {
    if (data.phishbit_settings) {
        CONFIG.WEBHOOK_URL = data.phishbit_settings.webhookUrl || CONFIG.WEBHOOK_URL;
        CONFIG.MAX_URLS_PER_SCAN = data.phishbit_settings.maxUrls || CONFIG.MAX_URLS_PER_SCAN;
        CONFIG.SCAN_TIMEOUT = data.phishbit_settings.scanTimeout || CONFIG.SCAN_TIMEOUT;
        console.log("Phish-Bit: Settings loaded from storage", CONFIG);
    }
});

// Storage for scanned URLs to prevent duplicates
const scannedUrls = new Set();
const detectedThreats = [];

// Listen for messages from popup and background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "MANUAL_SCAN") {
        // User clicked "Scan Page" button
        console.log("Phish-Bit: Manual scan triggered");
        
        // Clear previous scans for fresh detection
        scannedUrls.clear();
        detectedThreats.length = 0;
        
        // Reload settings before scanning
        chrome.storage.local.get(['phishbit_settings'], (data) => {
            if (data.phishbit_settings) {
                CONFIG.WEBHOOK_URL = data.phishbit_settings.webhookUrl || CONFIG.WEBHOOK_URL;
                CONFIG.MAX_URLS_PER_SCAN = data.phishbit_settings.maxUrls || CONFIG.MAX_URLS_PER_SCAN;
                CONFIG.SCAN_TIMEOUT = data.phishbit_settings.scanTimeout || CONFIG.SCAN_TIMEOUT;
            }
            
            // Perform scan
            scanForLinks();
            scanForQR();
            sendResponse({ success: true });
        });
        
        return true; // Keep channel open for async response
    } else if (request.type === "SETTINGS_UPDATED") {
        // Settings changed, update config
        if (request.settings) {
            CONFIG.WEBHOOK_URL = request.settings.webhookUrl || CONFIG.WEBHOOK_URL;
            CONFIG.MAX_URLS_PER_SCAN = request.settings.maxUrls || CONFIG.MAX_URLS_PER_SCAN;
            CONFIG.SCAN_TIMEOUT = request.settings.scanTimeout || CONFIG.SCAN_TIMEOUT;
            console.log("Phish-Bit: Settings updated", CONFIG);
        }
        sendResponse({ success: true });
    }
    return true;
});

/**
 * TASK 2: LINK SCANNING LOGIC
 */

function scanForLinks() {
    const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => a.href)
        .filter(href => href && (href.startsWith('http://') || href.startsWith('https://')))
        .slice(0, CONFIG.MAX_URLS_PER_SCAN);

    links.forEach(link => {
        if (!scannedUrls.has(link)) {
            scannedUrls.add(link);
            sendToBackend(link);
        }
    });

    // Also scan the current page
    if (!scannedUrls.has(window.location.href)) {
        scannedUrls.add(window.location.href);
        sendToBackend(window.location.href);
    }
}

/**
 * TASK 3: QR CODE SCANNING LOGIC
 */

function scanForQR() {
    const images = document.querySelectorAll('img');
    let qrCount = 0;

    images.forEach((img, index) => {
        if (qrCount >= 5) return; // Limit QR scans

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = () => {
            try {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code && code.data) {
                    console.log("▲ QR URL Detected:", code.data);
                    qrCount++;
                    if (!scannedUrls.has(code.data)) {
                        scannedUrls.add(code.data);
                        sendToBackend(code.data);
                    }
                }
            } catch (e) {
                console.debug("QR scan error:", e.message);
            }
        };
        image.onerror = () => {
            console.debug("Failed to load image:", img.src);
        };
        image.src = img.src || img.currentSrc;
    });
}

/**
 * TASK 4 & 5: BACKEND COMMUNICATION & WARNING INTERFACE
 */

async function sendToBackend(targetUrl) {
    if (!targetUrl) return;

    console.log("[Phish-Bit] Sending URL to backend:", targetUrl);
    console.log("[Phish-Bit] Backend URL:", CONFIG.WEBHOOK_URL);
    
    try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "User-Agent": "PhishBit-Extension/1.0"
            },
            body: JSON.stringify({ url: targetUrl }),
            timeout: CONFIG.SCAN_TIMEOUT
        });

        console.log("[Phish-Bit] Backend response status:", response.status);
        
        if (!response.ok) {
            console.warn("[Phish-Bit] Backend returned error status:", response.status);
            return;
        }

        const result = await response.json();
        console.log("[Phish-Bit] Backend verdict:", result.risk, "-", result.message);
        
        // If the verdict is Scam or Suspicious, trigger the warning
        if (result.risk === "Scam" || result.risk === "Suspicious") {
            detectedThreats.push({
                url: targetUrl,
                risk: result.risk,
                message: result.message || "Potential phishing link detected"
            });
            displayWarningBanner(result.message || "Phishing threat detected!");
            
            // Notify background script
            chrome.runtime.sendMessage({
                type: "THREAT_DETECTED",
                threat: {
                    url: targetUrl,
                    risk: result.risk,
                    message: result.message
                }
            }).catch(() => {
                // Background script may not be available in all contexts
            });
        }
    } catch (err) {
        console.error("[Phish-Bit] ❌ BACKEND CONNECTION FAILED:");
        console.error("[Phish-Bit] Error:", err.message);
        console.error("[Phish-Bit] Is n8n running at:", CONFIG.WEBHOOK_URL);
        console.error("[Phish-Bit] Is the workflow ACTIVE in n8n?");
    }
}

/**
 * Create and display the visual Warning Banner
 */
function displayWarningBanner(message) {
    // Prevent duplicate banners
    if (document.getElementById('phish-bit-alert')) return;

    try {
        const banner = document.createElement('div');
        banner.id = 'phish-bit-alert';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'assertive');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: linear-gradient(135deg, #ff0000, #cc0000);
            color: white;
            text-align: center;
            padding: 20px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            border-bottom: 3px solid #990000;
            animation: slideDown 0.3s ease-out;
        `;
        banner.innerHTML = `<strong>⚠️ PHISH-BIT WARNING:</strong> ${message} <button id="phish-bit-close" style="margin-left: 20px; padding: 5px 15px; background: white; color: red; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Dismiss</button>`;
        
        document.body.prepend(banner);
        
        // Add dismiss button handler
        document.getElementById('phish-bit-close').addEventListener('click', () => {
            banner.remove();
        });

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (banner.parentNode) banner.remove();
        }, 30000);
    } catch (e) {
        console.error("Error displaying warning banner:", e);
    }
}

/**
 * Monitor DOM changes for new content
 */
function setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                shouldScan = true;
            }
        });
        if (shouldScan) {
            setTimeout(() => {
                scanForLinks();
                scanForQR();
            }, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Initialize extension on page load
 */
function init() {
    console.log("Phish-Bit: Initializing on", window.location.href);
    scanForLinks();
    scanForQR();
    setupMutationObserver();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Re-scan periodically for dynamically loaded content
setInterval(() => {
    scanForLinks();
    scanForQR();
}, 30000);