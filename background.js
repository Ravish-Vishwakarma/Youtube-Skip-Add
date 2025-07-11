chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.url.includes("youtube.com")) {
        // Optional: alert if not on YouTube
        return;
    }

    // Inject content.js if not already injected, then run runSequence()
    // In Manifest V3, scripts are declared as content_scripts, so they auto-inject,
    // but to be safe, you can execute runSequence via scripting.executeScript.

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // The full skip logic must be inside this function or globally in content.js
            // Here we only call runSequence(), assuming it's defined in content.js
            if (typeof runSequence === "function") {
                runSequence();
            } else {
                console.log("runSequence not found");
            }
        }
    });
});
