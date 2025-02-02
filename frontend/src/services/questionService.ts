import { Question } from '../types/game';

const SYSTEM_PROMPT = `You are a quiz show host in the style of You Don't Know Jack. 
Generate engaging, witty questions with a mix of pop culture, history, science, and general knowledge.
Each question should have 4 options with only one correct answer.
Make the incorrect options plausible and sometimes humorous.
Include a brief explanation for the correct answer.`;

interface QuestionResponse {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuestion(): Promise<Question> {
  try {
    const response = await fetch('http://localhost:3001/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT,
        format: {
          text: "string - the question text",
          options: "array of 4 strings - possible answers",
          correctAnswer: "number - index of correct answer (0-3)",
          explanation: "string - brief explanation of the correct answer"
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate question');
    }

    const data: QuestionResponse = await response.json();
    
    return {
      id: Date.now().toString(), // We'll use timestamp as temporary ID
      ...data
    };
  } catch (error) {
    console.error('Error generating question:', error);
    // Return a fallback question if generation fails
    return {
      id: Date.now().toString(),
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and largest city of France."
    };
  }
}

export async function generateQuestionSet(count: number = 5): Promise<Question[]> {
  try {
    const questions = await Promise.all(
      Array(count).fill(null).map(() => generateQuestion())
    );
    return questions;
  } catch (error) {
    console.error('Error generating question set:', error);
    // Return mock questions if generation fails
    return [
      {
        id: '1',
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and largest city of France."
      },
      {
        id: '2',
        text: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars appears red due to iron oxide (rust) on its surface."
      }
    ];
  }
}
