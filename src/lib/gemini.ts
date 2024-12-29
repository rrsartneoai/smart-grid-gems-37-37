import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function generateGeminiResponse(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response');
  }
}

export async function generateStreamingResponse(prompt: string) {
  try {
    const result = await geminiModel.generateContentStream(prompt);
    return result;
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    throw new Error('Failed to generate streaming response');
  }
}