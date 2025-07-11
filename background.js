chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.url.includes("youtube.com")) {

        return;
    }





    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {


            if (typeof runSequence === "function") {
                runSequence();
            } else {
                console.log("runSequence not found");
            }
        }
    });
});
