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

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    explanation: 'Paris is the capital and largest city of France.'
  },
  {
    id: '2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    explanation: 'Mars appears red due to iron oxide (rust) on its surface.'
  },
  {
    id: '3',
    text: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2,
    explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519.'
  },
  {
    id: '4',
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correctAnswer: 1,
    explanation: 'The Blue Whale is the largest animal known to have ever existed.'
  },
  {
    id: '5',
    text: 'Which element has the chemical symbol Au?',
    options: ['Silver', 'Copper', 'Gold', 'Aluminum'],
    correctAnswer: 2,
    explanation: 'Au comes from the Latin word for gold, "aurum".'
  }
];

export async function generateQuestionSet(count: number = 5): Promise<Question[]> {
  // For testing, just return mock questions immediately
  return MOCK_QUESTIONS;
}
