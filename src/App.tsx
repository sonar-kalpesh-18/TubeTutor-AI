import { getVideoId } from "./utils/youtube";
import { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        setUrl(tabs[0]?.url || "");
        const currentUrl = tabs[0]?.url || "";
        setUrl(currentUrl);
        const id = getVideoId(currentUrl);
        if (id) {
          setVideoId(id);
        } else {
          setVideoId("No video ID found");
        }
      },
      
    );
  }, []);

  return (
    <div className="w-[400px] p-4">
      <h1 className="text-xl font-bold mb-4">TubeTutor AI</h1>

      <p className="font-semibold">Current Video:</p>

      <p className="break-all text-sm">{url}</p>
      <p className="mt-4 font-semibold">Video ID:</p>

      <p>{videoId}</p>
    </div>
  );
}

export default App;
