
async function runSkipAdSequence() {



    function getIframe() {
        return document.getElementById('iframe');
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function retryUntilSuccess(checkFn, interval = 500, timeout = 10000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (await checkFn()) {
                return true;
            }
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

    await runSequence();
}


function insertSkipButton() {
    const buttonContainer = document.querySelector('#top-level-buttons-computed');
    if (!buttonContainer) {
        console.log('Button container not found yet.');
        return;
    }

    if (document.querySelector('#skip-ad-button')) {

        return;
    }

    const btn = document.createElement('button');
    btn.id = 'skip-ad-button';


    btn.style.width = '40px';
    btn.style.height = '40px';
    btn.style.borderRadius = '50%';
    btn.style.background = 'rgba(50, 50, 50, 0.6)';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.marginLeft = '8px';
    btn.style.padding = '0';
    btn.style.backdropFilter = 'blur(4px)';


    btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
        <path d="M4 4v16l12-8zM16 4v16h2V4z"/>
    </svg>
    `;


    btn.title = 'Skip Ad';

    btn.onclick = () => {
        console.log('Skip Ad button clicked!');
        runSkipAdSequence();
    };

    buttonContainer.appendChild(btn);
    console.log('Skip Ad button inserted.');
}


if (location.href.includes('watch')) {
    setTimeout(() => {
        insertSkipButton();
    }, 1000);
}

let lastUrl = location.href;


new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        if (location.href.includes('watch')) {
            setTimeout(() => {
                insertSkipButton();
            }, 1000);
        }
    }
}).observe(document, { subtree: true, childList: true });
