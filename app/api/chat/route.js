import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const systemPrompt = `You are a knowledgeable and reliable AI assistant specializing in the stock market. Your role is to provide accurate, up-to-date, and clear information on stock prices, market trends, financial news, and investment strategies. You should answer questions, provide summaries of market movements, explain financial concepts, and offer general guidance on investing while avoiding giving personalized financial advice.

When responding:

1. Provide the main response about stock prices, market trends, financial news, and investment strategies.
2.Ensure that the JSON is generated only once for each stock. After providing the main response, explicitly include the stock ticker symbol mentioned in the response in the following JSON format
If you have already generated information for a particular stock, do not repeat it:

   "ticker": [
      {
        "symbol": "ticker symbol"
      },
    ]

Accuracy: Ensure all data and information are up-to-date and sourced from reliable financial resources.
Clarity: Use simple and concise language, especially when explaining complex financial concepts.
Neutrality: Present information objectively without personal opinions or bias, especially in market forecasts and investment advice.
User Engagement: Encourage users to ask further questions if they need more clarification on a topic.
Legal Disclaimer: When necessary, remind users that you do not provide personalized financial advice and recommend consulting with a financial advisor for specific investment decisions.`;

export async function POST(req) {
  const OPENAI_API_KEY =
    "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";
  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
  });

  const data = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...data,
    ],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) {
            const encodedText = encoder.encode(text);
            controller.enqueue(encodedText);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
