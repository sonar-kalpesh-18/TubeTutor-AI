import { useEffect, useState } from "react";
import { getVideoId } from "./utils/youtube";
import { getTranscript } from "./services/transcript";

function App() {
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async (tabs: chrome.tabs.Tab[]) => {
        const currentUrl = tabs[0]?.url || "";

        const id = getVideoId(currentUrl);

        if (!id) return;

        setVideoId(id);

        setLoading(true);

        console.log("Video ID:", id);
        const text = await getTranscript(id);
        console.log("Transcript:", text);

        if (text) {
          setTranscript(text);
        }

        setLoading(false);

        chrome.tabs.sendMessage(tabs[0].id!, { type: "PING" }, (response) => {
          console.log(response);

          if (response.success) {
            setTranscript(response.transcript || "No transcript found");
          } else {
            setTranscript(response.error || "Something went wrong");
          }
          setTranscript(
            response.transcriptFound
              ? "Transcript button found"
              : "Transcript button not found",
          );

          if (response.transcriptCount > 0) {
            setTranscript(response.transcript);
          } else {
            setTranscript("Transcript panel not opened yet");
          }

          if (response?.message) {
            setTranscript(response?.title || "No title found");
            console.log(response);
          }
        });
      },
    );
  }, []);

  return (
    <div className="w-96 p-4">
      <h1 className="text-xl font-bold mb-4">TubeTutor AI</h1>

      <p className="font-semibold">Video ID:</p>

      <p className="mb-4 break-all text-sm">{videoId}</p>

      <p className="font-semibold">Transcript:</p>

      {loading ? (
        <p>Loading transcript...</p>
      ) : (
        <p className="text-sm whitespace-pre-wrap">
          {transcript ? transcript.slice(0, 500) : "No data"}
        </p>
      )}
    </div>
  );
}

export default App;
