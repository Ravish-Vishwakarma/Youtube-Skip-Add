document.getElementById('run').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: runSequence
    });
});

// This needs to be redefined here to inject into the page
function runSequence() {
    // Paste the entire function definitions from your original code here
    // Starting from getIframe() down to runSequence()

    // Paste starts here:
    function getIframe() {
        return document.getElementById('iframe');
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryUntilSuccess(checkFn, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (await checkFn()) return true;
            await wait(interval);
        }
        throw new Error('Timeout');
    }

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

    async function getIframeDocument() {
        const iframe = getIframe();
        if (!iframe) return null;

        while (!iframe.contentDocument) {
            await wait(200);
        }
        return iframe.contentDocument;
    }

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

    function tryClickOverlayBackdrop() {
        const overlay = document.querySelector('tp-yt-iron-overlay-backdrop.opened');
        if (overlay) {
            overlay.click();
            return true;
        }
        return false;
    }

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
}
