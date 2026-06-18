import { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: chrome.tabs.Tab[]) => {
        setUrl(tabs[0]?.url || "");
      }
    );
  }, []);

  return (
    <div className="w-[400px] p-4">
      <h1 className="text-xl font-bold mb-4">
        TubeTutor AI
      </h1>

      <p className="font-semibold">
        Current Video:
      </p>

      <p className="break-all text-sm">
        {url}
      </p>
    </div>
  );
}

export default App;