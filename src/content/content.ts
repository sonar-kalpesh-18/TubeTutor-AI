console.log("TubeTutor Content Script Loaded");

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type === "PING") {
      const title =
        document.querySelector(
          "h1.ytd-watch-metadata yt-formatted-string"
        )?.textContent || "No title found";

      sendResponse({
        success: true,
        title,
      });
    }

    return true;
  }
);