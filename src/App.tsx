import { useEffect, useState } from "react";
import { getVideoId } from "./utils/youtube";
import { getTranscript } from "./services/transcript";
import { generateSummary } from "./services/gemini";
import { cleanTranscript } from "./utils/cleanTranscript";

function App() {
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [_summary, setSummary] = useState("");
  const [_summaryLoading, setSummaryLoading] = useState(false);

  async function handleSummary() {
    setSummaryLoading(true);
    const cleanedTranscript = cleanTranscript(transcript);
    const result = await generateSummary(cleanedTranscript);
    console.log("Gemini Response:", result);
    setSummary(result);

    setSummaryLoading(false);
  }

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

      <button
        onClick={handleSummary}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Summary
      </button>

      <div className="mt-4">
        <h2 className="font-bold">Summary</h2>

        {_summaryLoading ? (
          <p>Generating...</p>
        ) : (
          <p className="whitespace-pre-wrap">{_summary}</p>
        )}
      </div>

      <p className="font-semibold">Transcript:</p>

      {loading ? (
        <p>Loading transcript...</p>
      ) : (
        <p className="text-sm whitespace-pre-wrap">
          {transcript ? "Transcript found" : "No data"}
        </p>
      )}
    </div>
  );
}

export default App;
