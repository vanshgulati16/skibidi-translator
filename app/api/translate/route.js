import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { text, mode } = await request.json();
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct prompt based on mode
    const prompt = mode === 'toSkibidi' 
      ? `Convert this normal text to Gen Alpha/Skibidi slang style. Make it sound playful and use terms like "fr fr", "no cap", "bussin", "gyatt", etc: "${text}"`
      : `Convert this Gen Alpha/Skibidi slang text to normal, formal English: "${text}"`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return Response.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return Response.json(
      { error: 'Failed to translate text' },
      { status: 500 }
    );
  }
} 