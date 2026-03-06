// Phish-Bit: Member 1 - Interceptor Script
console.log("Phish-Bit: Interceptor Active. Scanning for threats...");

/**
 * TASK 2 & 3: SCANNING LOGIC
 */

// 1. Capture all standard hyperlinks
const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
if (links.length > 0) {
    // For testing, we send the current page or first link
    sendToBackend(window.location.href); 
}

// 2. Scan for QR Codes in images using jsQR library
function scanForQR() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.crossOrigin = "Anonymous"; 
        image.src = img.src;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            try {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    console.log("▲ QR URL Detected:", code.data);
                    sendToBackend(code.data); 
                }
            } catch (e) {
                // Cross-origin images often block pixel access
            }
        };
    });
}

/**
 * TASK 4 & 5: BACKEND COMMUNICATION & WARNING INTERFACE
 */

// 3. Send detected URL to n8n Webhook
async function sendToBackend(targetUrl) {
    // IMPORTANT: Replace this with the real URL from Team Member 2
    const webhookUrl = "https://your-team-member-2-n8n-url.com"; 
    
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: targetUrl })
        });

        // Wait for the response from the AI (Member 3)
        const result = await response.json();
        
        // If the verdict is Scam or Suspicious, trigger the warning
        if (result.risk === "Scam" || result.risk === "Suspicious") {
            displayWarningBanner(result.message);
        }
    } catch (err) {
        console.error("Phish-Bit connection error. Waiting for backend workflow...");
    }
}

// 4. Create and display the visual Warning Banner
function displayWarningBanner(message) {
    // Prevent duplicate banners
    if (document.getElementById('phish-bit-alert')) return;

    const banner = document.createElement('div');
    banner.id = 'phish-bit-alert';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #ff0000;
        color: white;
        text-align: center;
        padding: 20px;
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `⚠️ PHISH-BIT WARNING: ${message}`;
    document.body.prepend(banner);
}

// Execute QR scan on page load
scanForQR();