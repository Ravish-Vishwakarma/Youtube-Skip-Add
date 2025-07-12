chrome.runtime.onInstalled.addListener(() => {
    // Initialize storage with default value
    chrome.storage.local.get("autoSkip", (data) => {
        if (data.autoSkip === undefined) {
            chrome.storage.local.set({ autoSkip: false })
        }
        
        chrome.contextMenus.create({
            id: "toggle-auto-skip",
            title: "Skip automatically",
            type: "checkbox",
            contexts: ["action"],
            checked: !!data.autoSkip,
        })
    })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "toggle-auto-skip") {
        const newCheckedState = info.checked
        chrome.storage.local.set({ autoSkip: newCheckedState }, () => {
            // Notify all content scripts about the change
            chrome.tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.tabs
                    .sendMessage(tab.id, {
                        action: "autoSkipChanged",
                        autoSkip: newCheckedState,
                    })
                    .catch(() => {
                        // Ignore errors if content script isn't loaded
                    })
                })
            })
        })
    }
})

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getAutoSkip") {
        chrome.storage.local.get("autoSkip", (data) => {
            sendResponse({ autoSkip: !!data.autoSkip })
        })
        return true // Keep the message channel open for async response
    }
})

// Listen for storage changes and notify content scripts
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.autoSkip) {
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs
                .sendMessage(tab.id, {
                    action: "autoSkipChanged",
                    autoSkip: changes.autoSkip.newValue,
                })
                .catch(() => {
                    // Ignore errors if content script isn't loaded
                })
            })
        })
    }
})

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                if (typeof runSkipAdSequence === "function") {
                    runSkipAdSequence()
                } else {
                    console.error("runSkipAdSequence is not defined on this page.")
                }
            },
        })
    }
})
