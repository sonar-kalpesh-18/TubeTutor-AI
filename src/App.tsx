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
      }
    );
  }, []);

  return (
    <div className="w-96 p-4">
      <h1 className="text-xl font-bold mb-4">
        TubeTutor AI
      </h1>

      <p className="font-semibold">
        Video ID:
      </p>

      <p className="mb-4 break-all text-sm">
        {videoId}
      </p>

      <p className="font-semibold">
        Transcript:
      </p>

      {loading ? (
        <p>Loading transcript...</p>
      ) : (
        <p className="text-sm whitespace-pre-wrap">
          {transcript.slice(0, 500)}
        </p>
      )}
    </div>
  );
}

export default App;