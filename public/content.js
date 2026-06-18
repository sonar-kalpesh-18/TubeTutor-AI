console.log("TubeTutor Content Script Loaded");

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "PING") {
      sendResponse({
        success: true,
        message: "Content script is running",
      });
    }

    return true;
  }
);