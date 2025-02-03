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
}

export async function generateQuestionSet(count: number = 5): Promise<Question[]> {
  const questions = await Promise.all(
    Array(count).fill(null).map(() => generateQuestion())
  );
  return questions;
}
