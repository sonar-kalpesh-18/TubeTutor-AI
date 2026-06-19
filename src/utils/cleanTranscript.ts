export function cleanTranscript(text: string) {
  return text
    .replace(/\d+:\d+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\[.*?\]/g, "")
    .trim();
}