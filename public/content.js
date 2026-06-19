console.log("TubeTutor Content Script Loaded");

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "PING") {
       const title =
        document.querySelector(
          "h1.ytd-watch-metadata yt-formatted-string"
        )?.textContent || "No title found";

 const transcriptButton =
        [...document.querySelectorAll("button")]
          .find(btn =>
            btn.textContent?.toLowerCase().includes("transcript")
          );

      sendResponse({
        success: true,
        title,
        transcriptFound: !!transcriptButton,
        transcriptText: transcriptButton?.textContent || null,
      });
    }

    return true;
  }
);