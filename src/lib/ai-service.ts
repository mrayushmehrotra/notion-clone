import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
// Initialize Google Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate image description using Google Gemini API
export async function generateImagePrompt(name: string): Promise<string> {
  try {
    const prompt1 =
      "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the GOOGLE GEMINI API to generate a thumbnail. The description should be minimalistic and flat styled";
    const prompt2 = `Please generate a thumbnail description for my notebook titles ${name}`;
    const res = await model.generateContent(prompt1 + prompt2);
    console.log(res);

    const image_description = res.response.text();
    console.log(image_description);
    return image_description as string;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
