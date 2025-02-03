import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Quiz-Show-Game",
  }
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet:beta",
      messages: [
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
      ]
    });

    console.log(completion.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
