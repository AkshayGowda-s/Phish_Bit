// Phish-Bit Options Page
const DEFAULT_SETTINGS = {
    webhookUrl: "http://localhost:5678/webhook/check-url",
    enableNotifications: true,
    enableSound: true,
    maxUrls: 20,
    scanTimeout: 5000
};

const STORAGE_KEY = 'phishbit_settings';

// Load settings on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
    document.getElementById('clearBtn').addEventListener('click', clearHistory);
}

function loadSettings() {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
        const settings = data[STORAGE_KEY] || DEFAULT_SETTINGS;
        
        document.getElementById('webhookUrl').value = settings.webhookUrl || DEFAULT_SETTINGS.webhookUrl;
        document.getElementById('enableNotifications').checked = settings.enableNotifications !== false;
        document.getElementById('enableSound').checked = settings.enableSound !== false;
        document.getElementById('maxUrls').value = settings.maxUrls || DEFAULT_SETTINGS.maxUrls;
        document.getElementById('scanTimeout').value = settings.scanTimeout || DEFAULT_SETTINGS.scanTimeout;
    });
}

function saveSettings() {
    const settings = {
        webhookUrl: document.getElementById('webhookUrl').value,
        enableNotifications: document.getElementById('enableNotifications').checked,
        enableSound: document.getElementById('enableSound').checked,
        maxUrls: parseInt(document.getElementById('maxUrls').value) || 20,
        scanTimeout: parseInt(document.getElementById('scanTimeout').value) || 5000
    };

    // Validate webhook URL
    if (settings.webhookUrl && !isValidUrl(settings.webhookUrl)) {
        showStatus('Invalid webhook URL format', 'error');
        return;
    }

    chrome.storage.local.set({ [STORAGE_KEY]: settings }, () => {
        showStatus('✓ Settings saved successfully', 'success');
        
        // Notify content scripts of settings change
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    type: "SETTINGS_UPDATED",
                    settings: settings
                }).catch(() => {
                    // Tab may not have content script
                });
            });
        });
    });
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_SETTINGS }, () => {
            loadSettings();
            showStatus('✓ Settings reset to default', 'success');
        });
    }
}

function clearHistory() {
    if (confirm('Clear all threat history? This cannot be undone.')) {
        chrome.runtime.sendMessage({ type: "CLEAR_THREATS" }, (response) => {
            if (response.success) {
                showStatus('✓ Threat history cleared', 'success');
            } else {
                showStatus('✗ Failed to clear history', 'error');
            }
        });
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    setTimeout(() => {
        statusDiv.className = 'status';
    }, 4000);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

console.log("Phish-Bit Options page loaded");
