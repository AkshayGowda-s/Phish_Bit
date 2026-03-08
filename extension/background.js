// Phish-Bit: Background Service Worker
// Handles message passing and threat tracking

const THREAT_STORAGE_KEY = 'phishbit_threats';
const MAX_THREATS_STORED = 100;

let threats = [];

// Load threats from storage on startup
chrome.storage.local.get(THREAT_STORAGE_KEY, (data) => {
    if (data[THREAT_STORAGE_KEY]) {
        threats = data[THREAT_STORAGE_KEY];
    }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Background: Received message", request.type);

    if (request.type === "THREAT_DETECTED") {
        // Add threat to storage
        const threat = {
            ...request.threat,
            timestamp: new Date().toISOString(),
            tabUrl: sender.url
        };
        
        threats.unshift(threat); // Add to beginning
        if (threats.length > MAX_THREATS_STORED) {
            threats = threats.slice(0, MAX_THREATS_STORED);
        }

        // Save to storage
        chrome.storage.local.set({ [THREAT_STORAGE_KEY]: threats });

        // Update badge
        updateBadge(threats.length);

        // Log for debugging
        console.log("Threat stored:", threat);
        sendResponse({ success: true });
    } 
    else if (request.type === "GET_THREATS") {
        // Get the current tab URL to filter threats for that page only
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                const currentUrl = tabs[0].url;
                // Only show threats detected on the current page
                const currentPageThreats = threats.filter(threat => threat.tabUrl === currentUrl);
                sendResponse({ threats: currentPageThreats });
            } else {
                sendResponse({ threats: threats });
            }
        });
        return true; // Keep channel open for async response
    } 
    else if (request.type === "CLEAR_THREATS") {
        threats = [];
        chrome.storage.local.set({ [THREAT_STORAGE_KEY]: [] });
        updateBadge(0);
        sendResponse({ success: true });
    }
    else if (request.type === "GET_THREAT_COUNT") {
        sendResponse({ count: threats.length });
    }

    return true; // Keep the message channel open for async response
});

/**
 * Update extension icon badge with threat count
 */
function updateBadge(count) {
    if (count > 0) {
        chrome.action.setBadgeText({ text: count.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#ff0000' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

console.log("Phish-Bit: Background service worker loaded");
