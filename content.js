/**
 * YouTube Ad Skipper (v5 - Final, Direct Control)
 * This script is stable and skips ads by directly manipulating the video player,
 * which is more reliable than simulating clicks. It also properly injects a
 * manual skip button into the player UI.
 */

console.log("YouTube Ad Skipper: Initializing (Direct Control Mode)");

// --- CORE FUNCTIONS ---

/**
 * Finds any active ad video and force-skips it by fast-forwarding to the end.
 * This is the primary ad-skipping mechanism.
 */
const forceSkipAd = () => {
    // Ads on YouTube play in a container with the class 'ad-showing'.
    const adContainer = document.querySelector('.ad-showing');
    if (!adContainer) {
        return; // No ad is showing, so we do nothing.
    }

    // Find the actual HTML5 video element within the ad container.
    const adVideo = adContainer.querySelector('video');

    // If we find an ad video and it has a valid duration, skip it.
    if (adVideo && adVideo.duration) {
        // **The Fix:** Don't click. Force the video's time to its end.
        adVideo.currentTime = adVideo.duration;
        console.log(`Skipper: Force-skipped ad by setting currentTime to ${adVideo.duration}`);
    }

    // We also click the button as a backup to help dismiss the ad's UI elements.
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
    if (skipButton) {
        skipButton.click();
    }
};

/**
 * Creates and injects the manual skip button into the player's control bar.
 * It uses YouTube's own styles to ensure it looks perfect.
 */
const insertManualSkipButton = () => {
    const controlsContainer = document.querySelector('.ytp-right-controls');

    // Stop if the player controls aren't ready or if our button is already there.
    if (!controlsContainer || document.getElementById('skipper-manual-force-skip-button')) {
        return;
    }

    const manualButton = document.createElement('button');
    manualButton.id = 'skipper-manual-force-skip-button';

    // Use YouTube's native class for seamless styling. This is crucial.
    manualButton.className = 'ytp-button';
    manualButton.title = 'Force Skip Ad';

    // **This line is now fixed and complete.**
    manualButton.innerHTML = `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-13"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-id-13"></path></svg>`;

    // Make the button trigger our new force-skip function.
    manualButton.onclick = forceSkipAd;

    // Place the button before the "Settings" gear for a consistent position.
    const settingsButton = controlsContainer.querySelector('.ytp-settings-button');
    if (settingsButton) {
        controlsContainer.insertBefore(manualButton, settingsButton);
    }
};

// --- MAIN OBSERVER ---

// A single, powerful MutationObserver watches for all changes on the page.
const observer = new MutationObserver(() => {
    // Every time the page updates, we run our functions.
    forceSkipAd();            // Check for any ads that need to be skipped.
    insertManualSkipButton(); // Check if our button needs to be added to the UI.
});

// Start the observer.
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("YouTube Ad Skipper: Observer is active and ready.");