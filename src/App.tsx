import { useEffect, useState } from "react";
import { getVideoId } from "./utils/youtube";
import { generateSummary, extractConcepts } from "./services/gemini";
import { cleanTranscript } from "./utils/cleanTranscript";

function App() {
  const [videoId, setVideoId] = useState("");
  const [transcript, setTranscript] = useState("");

  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [concepts, setConcepts] = useState("");
  const [conceptsLoading, setConceptsLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSummary() {
    if (!transcript) return;

    try {
      setSummaryLoading(true);

      const cleanedTranscript = cleanTranscript(transcript);

      const result = await generateSummary(cleanedTranscript);

      console.log("Gemini Summary:", result);

      setSummary(result);
    } catch (error) {
      console.error(error);
      setSummary("Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleConcepts() {
    if (!transcript) return;

    try {
      setConceptsLoading(true);

      const cleanedTranscript = cleanTranscript(transcript);

      const result = await extractConcepts(cleanedTranscript);

      console.log("Concepts:", result);

      setConcepts(result);
    } catch (error) {
      console.error(error);
      setConcepts("Failed to extract concepts.");
    } finally {
      setConceptsLoading(false);
    }
  }

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        const currentUrl = tabs[0]?.url || "";

        const id = getVideoId(currentUrl);

        if (!id) return;

        setVideoId(id);

        setLoading(true);

        chrome.tabs.sendMessage(
          tabs[0].id!,
          { type: "PING" },
          (response) => {
            console.log(response);

            if (response?.success) {
              setTranscript(response.transcript || "");
            } else {
              setTranscript("");
            }

            setLoading(false);
          }
        );
      }
    );
  }, []);

  return (
    <div className="w-[450px] p-4">
      <h1 className="text-2xl font-bold mb-4">
        TubeTutor AI
      </h1>

      <p className="font-semibold">
        Video ID
      </p>

      <p className="mb-4 text-sm break-all">
        {videoId}
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSummary}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Generate Summary
        </button>

        <button
          onClick={handleConcepts}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Extract Concepts
        </button>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2">
          Summary
        </h2>

        {summaryLoading ? (
          <p>Generating summary...</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm">
            {summary}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-lg mb-2">
          Key Concepts
        </h2>

        {conceptsLoading ? (
          <p>Extracting concepts...</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm">
            {concepts}
          </p>
        )}
      </div>

      <div>
        <h2 className="font-bold text-lg mb-2">
          Transcript Status
        </h2>

        {loading ? (
          <p>Loading transcript...</p>
        ) : (
          <p>
            {transcript
              ? "✅ Transcript loaded"
              : "❌ Transcript not found"}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;