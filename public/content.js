chrome.runtime.onMessage.addListener(
  async (message, sender, sendResponse) => {
    if (message.type === "PING") {
      try {
        const title =
          document.querySelector(
            "h1.ytd-watch-metadata yt-formatted-string"
          )?.textContent || "No title found";

        let transcriptButton =
          [...document.querySelectorAll("button")]
            .find(btn =>
              btn.textContent?.toLowerCase().includes("transcript")
            );

        if (transcriptButton) {
          transcriptButton.click();

          await new Promise(resolve =>
            setTimeout(resolve, 1500)
          );
        }

        const transcriptSegments =
          document.querySelectorAll(
            "ytd-transcript-segment-renderer"
          );

        const transcript =
          Array.from(transcriptSegments)
            .map(segment =>
              segment.textContent?.trim()
            )
            .join(" ");

        sendResponse({
          success: true,
          title,
          transcript,
          transcriptCount:
            transcriptSegments.length
        });
      } catch (error) {
        console.error(error);

        sendResponse({
          success: false,
          error: error.message
        });
      }
    }

    return true;
  }
);