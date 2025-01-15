// /api/completion

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
  // Extract the prompt from the body
  const { prompt } = await req.json();

  // Validate if prompt is provided
  if (!prompt) {
    return new Response("Prompt is required", { status: 400 });
  }

  try {
    // Prepare the system and user content
    const content = `
{ 
role: "system", 
content: "You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences. The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness. AI is a well-behaved and well-mannered individual. AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user."
},
{ 
role: "user", 
content: "I am writing a piece of text in a notion text editor app. Help me complete my train of thought here: ##${prompt}## keep the tone of the text consistent with the rest of the text. Keep the response short and sweet."
}
`;

    // Generate the content
    const result = await model.generateContent(content);

    // Return the response text
    return new Response(result.response.text(), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
