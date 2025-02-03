import { Question } from '../types/game';

const SYSTEM_PROMPT = `You are a quiz show host in the style of You Don't Know Jack. 
Generate engaging, witty questions with a mix of pop culture, history, science, and general knowledge.
Each question should have 4 options with only one correct answer.
Make the incorrect options plausible and sometimes humorous.
Include a brief explanation for the correct answer.

IMPORTANT: Each time you are called, generate a completely different question. 
Never repeat the same topic or subject matter as your previous questions.
Mix up the categories - if the last question was about history, maybe do science next, 
or if it was about movies, try sports or technology.`;

interface QuestionResponse {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuestion(gameId: string): Promise<Question> {
  const response = await fetch(`http://localhost:3001/api/generate-question?gameId=${encodeURIComponent(gameId)}`, {
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
  // Generate a unique game ID
  const gameId = Date.now().toString();
  
  // Get first question to trigger generation of full set
  const firstQuestion = await generateQuestion(gameId);
  
  // Get remaining questions one at a time
  const questions = [firstQuestion];
  for (let i = 1; i < count; i++) {
    const question = await generateQuestion(gameId);
    questions.push(question);
  }
  
  return questions;
}
