import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateSummary(transcript: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
  Summarize the following YouTube transcript.

  Give:
  1. Short Summary
  2. Key Points

  Transcript:
  ${transcript}
  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

export async function extractConcepts(
  transcript: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
  Extract the 10 most important concepts.

  Format:

  Concept Name:
  One line explanation

  Transcript:
  ${transcript}
  `;

  const result =
    await model.generateContent(prompt);

  return result.response.text();
}