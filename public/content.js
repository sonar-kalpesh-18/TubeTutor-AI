chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "PING") {

      const title =
        document.querySelector(
          "h1.ytd-watch-metadata yt-formatted-string"
        )?.textContent || "No title found";

      const transcriptSegments = document.querySelectorAll(
        "ytd-transcript-segment-renderer"
      );

      const transcript = Array.from(transcriptSegments)
        .map(segment => segment.textContent?.trim())
        .join(" ");

      sendResponse({
        success: true,
        title,
        transcript,
        transcriptCount: transcriptSegments.length
      });
    }

    return true;
  }
);