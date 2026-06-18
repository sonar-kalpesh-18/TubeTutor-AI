import { YoutubeTranscript } from "youtube-transcript";

export async function getTranscript(videoId: string) {
  try {
    console.log("Fetching transcript for:", videoId);

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    console.log("Transcript response:", transcript);

    return transcript.map((item) => item.text).join(" ");
  } catch (error) {
    console.error("Transcript fetch failed:", error);
    return null;
  }
}