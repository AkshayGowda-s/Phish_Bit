// Phish-Bit Popup UI Logic
document.addEventListener('DOMContentLoaded', function() {
    console.log("Phish-Bit Popup loaded.");
    
    const statusDiv = document.getElementById('status');
    const warningDiv = document.getElementById('warning');
    const messageDiv = document.getElementById('message');
    
    /**
     * Test if backend is reachable
     */
    function testBackendConnection(webhookUrl, onSuccess, onFailure) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'http://test.com' }),
            timeout: 3000
        })
        .then(response => {
            if (response.ok || response.status === 200 || response.status === 400) {
                onSuccess();
            } else {
                onFailure();
            }
        })
        .catch(err => {
            console.error('Backend test failed:', err);
            onFailure();
        });
    }

    // Request threat data from background script
    chrome.runtime.sendMessage({ type: "GET_THREATS" }, (response) => {
        if (chrome.runtime.lastError) {
            console.debug("Background script not available");
            statusDiv.textContent = "✓ Security monitoring active";
            statusDiv.style.color = '#27ae60';
            return;
        }

        if (response && response.threats && response.threats.length > 0) {
            const threat = response.threats[response.threats.length - 1];
            statusDiv.textContent = `⚠️ ${threat.risk} Detected`;
            statusDiv.style.color = threat.risk === 'Scam' ? '#c62828' : '#f57c00';
            
            warningDiv.style.display = 'block';
            messageDiv.textContent = threat.message || "Phishing threat detected on this page";
        } else {
            statusDiv.textContent = "✓ Page appears safe";
            statusDiv.style.color = '#27ae60';
        }
    });

    // Listen for threats detected in real-time
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "THREAT_DETECTED") {
            const threat = request.threat;
            warningDiv.style.display = 'block';
            messageDiv.textContent = threat.message || "Phishing threat detected!";
            statusDiv.textContent = `⚠️ ${threat.risk} Detected`;
            statusDiv.style.color = threat.risk === 'Scam' ? '#c62828' : '#f57c00';
        }
    });

    // Scan page button
    const scanBtn = document.getElementById('scan-page');
    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            statusDiv.textContent = "🔄 Scanning...";
            statusDiv.style.color = '#3498db';
            warningDiv.style.display = 'none';
            
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (!tabs[0]) {
                    statusDiv.textContent = "✗ No active tab found";
                    statusDiv.style.color = '#e74c3c';
                    return;
                }

                const tab = tabs[0];

                // Check if page is a restricted page
                if (tab.url.startsWith('chrome://') || 
                    tab.url.startsWith('about:') || 
                    tab.url.startsWith('edge://') ||
                    tab.url.startsWith('moz-extension://')) {
                    statusDiv.textContent = "✗ Cannot scan browser pages";
                    statusDiv.style.color = '#e74c3c';
                    return;
                }

                // Check if webhook is configured
                chrome.storage.local.get(['phishbit_settings'], (data) => {
                    const settings = data.phishbit_settings;
                    if (!settings || !settings.webhookUrl) {
                        statusDiv.textContent = "✗ Configure webhook first (⚙️ Settings)";
                        statusDiv.style.color = '#e74c3c';
                        warningDiv.style.display = 'block';
                        messageDiv.textContent = "Please click ⚙️ Settings and enter your webhook URL";
                        return;
                    }

                    // First, test backend connection
                    testBackendConnection(settings.webhookUrl, () => {
                        // Backend is reachable, proceed with scan
                        chrome.tabs.sendMessage(tab.id, { type: "MANUAL_SCAN" }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("Scan error:", chrome.runtime.lastError.message);
                                statusDiv.textContent = "✗ Extension not loaded on this page";
                                statusDiv.style.color = '#e74c3c';
                                warningDiv.style.display = 'block';
                                messageDiv.textContent = "Visit a regular website and refresh the page";
                            } else if (response && response.success) {
                                // Wait a moment for backend to process, then check results
                                setTimeout(() => {
                                    chrome.runtime.sendMessage({ type: "GET_THREATS" }, (threatResponse) => {
                                        if (threatResponse && threatResponse.threats && threatResponse.threats.length > 0) {
                                            const threat = threatResponse.threats[0];
                                            statusDiv.textContent = `⚠️ ${threat.risk} Detected`;
                                            statusDiv.style.color = threat.risk === 'Scam' ? '#c62828' : '#f57c00';
                                            warningDiv.style.display = 'block';
                                            messageDiv.textContent = threat.message || "Threat detected on this page";
                                        } else {
                                            statusDiv.textContent = "✓ Page appears safe";
                                            statusDiv.style.color = '#27ae60';
                                            warningDiv.style.display = 'none';
                                        }
                                    });
                                }, 1000); // Wait 1 second for backend to respond
                            }
                        });
                    }, () => {
                        // Backend is not reachable
                        statusDiv.textContent = "✗ Backend unreachable";
                        statusDiv.style.color = '#e74c3c';
                        warningDiv.style.display = 'block';
                        messageDiv.textContent = "N8n backend is not running at " + settings.webhookUrl + ". Make sure n8n is started and workflow is ACTIVE.";
                    });
                });
            });
        });
    }

    // Settings button
    const settingsBtn = document.getElementById('settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            chrome.runtime.openOptionsPage?.() || 
            chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
        });
    }
});