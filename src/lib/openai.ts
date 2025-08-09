import OpenAI from "openai";

// Initialize OpenAI client only on server side
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (typeof window !== 'undefined') {
      // Client-side: don't instantiate OpenAI client
      throw new Error("OpenAI client cannot be used on the client side. Use the API routes instead.");
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
    }
    
    openai = new OpenAI({
      apiKey,
    });
  }
  return openai;
}

export default getOpenAI;

// Helper function to create a chat completion
export async function createChatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: string = "gpt-4o-mini"
) {
  try {
    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("OpenAI API error:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.");
    }
    throw new Error("Failed to generate AI response");
  }
}

// Helper function for simple text generation
export async function generateText(prompt: string, model: string = "gpt-4o-mini") {
  return createChatCompletion([
    {
      role: "user",
      content: prompt,
    },
  ], model);
} 