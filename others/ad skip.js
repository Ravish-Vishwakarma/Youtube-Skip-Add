// // Helper to get the iframe element
// function getIframe() {
//     return document.getElementById('iframe');
// }

// // Clicks the main ad skip button if present
// function clickAdButton() {
//     const adButton = document.querySelector('.ytp-ad-button.ytp-ad-button-link.ytp-ad-clickable.ytp-ad-hover-text-button--clean-player');
//     if (adButton) adButton.click();
// }

// // Clicks the "Block" button inside the iframe if present
// function clickBlockButtonInIframe() {
//     const iframe = getIframe();
//     const iframeDoc = iframe?.contentDocument;
//     if (!iframeDoc) return;

//     const blockButton = iframeDoc.querySelector('button[aria-label="Block"]');
//     if (blockButton) {
//         blockButton.click();
//     } else {
//         setTimeout(clickBlockButtonInIframe, 500);
//     }
// }


// // Clicks the "Continue" button inside the iframe if present
// function clickContinueButtonInIframe() {
//     const iframe = getIframe();
//     const iframeDoc = iframe?.contentDocument;
//     if (!iframeDoc) return;

//     const continueButton = [...iframeDoc.querySelectorAll('div[role="button"]')].find(btn => {
//         const span = btn.querySelector('span.RveJvd.snByac');
//         return span && span.textContent.trim() === 'CONTINUE' && btn.offsetParent !== null;
//     });

//     if (continueButton) {
//         continueButton.click();
//         console.log('Continue button clicked');
//     } else {
//         setTimeout(clickContinueButtonInIframe, 500);
//     }
// }

// function clickOverlayBackdrop() {
//     const overlay = document.querySelector('tp-yt-iron-overlay-backdrop.opened');
//     if (overlay) overlay.click();
// }



// Get the iframe element by ID
function getIframe() {
    return document.getElementById('iframe');
}

// Pause execution for a given number of milliseconds
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry a check function repeatedly until it returns true or times out
async function retryUntilSuccess(checkFn, interval = 500, timeout = 10000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (await checkFn()) {
            return true; // Success
        }
        await wait(interval);
    }

    throw new Error('Timeout'); // Failed after timeout
}

// Try to click the main ad skip button
function tryClickAdButton() {
    const adButton = document.querySelector(
        '.ytp-ad-button.ytp-ad-button-link.ytp-ad-clickable.ytp-ad-hover-text-button--clean-player'
    );
    if (adButton) {
        adButton.click();
        return true;
    }
    return false;
}

// Wait until iframe document is ready and return it
async function getIframeDocument() {
    const iframe = getIframe();
    if (!iframe) return null;

    while (!iframe.contentDocument) {
        await wait(200);
    }
    return iframe.contentDocument;
}

// Try to click "Block" button inside iframe
async function tryClickBlockButtonInIframe() {
    const doc = await getIframeDocument();
    if (!doc) return false;

    const blockButton = doc.querySelector('button[aria-label="Block"]');
    if (blockButton) {
        blockButton.click();
        return true;
    }
    return false;
}

// Try to click "CONTINUE" button inside iframe
async function tryClickContinueButtonInIframe() {
    const doc = await getIframeDocument();
    if (!doc) return false;

    const continueButton = [...doc.querySelectorAll('div[role="button"]')].find(btn => {
        const span = btn.querySelector('span.RveJvd.snByac');
        return span && span.textContent.trim() === 'CONTINUE' && btn.offsetParent !== null;
    });

    if (continueButton) {
        continueButton.click();
        console.log('Continue button clicked');
        return true;
    }
    return false;
}

// Try to click overlay backdrop
function tryClickOverlayBackdrop() {
    const overlay = document.querySelector('tp-yt-iron-overlay-backdrop.opened');
    if (overlay) {
        overlay.click();
        return true;
    }
    return false;
}

// Main sequential flow with retry and 1-second pause between steps
async function runSequence() {
    try {
        await wait(500);
        await retryUntilSuccess(tryClickAdButton);
        console.log('Ad button clicked');

        await wait(500);
        await retryUntilSuccess(tryClickBlockButtonInIframe);
        console.log('Block button clicked');

        await wait(500);
        await retryUntilSuccess(tryClickContinueButtonInIframe);
        console.log('Continue button clicked');

        await wait(500);
        await retryUntilSuccess(tryClickOverlayBackdrop);
        console.log('Overlay backdrop clicked');

    } catch (error) {
        console.log('Sequence stopped:', error.message);
    }
}

runSequence();
