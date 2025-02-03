import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import { AIClient } from '@shared/api_config';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize AI client
let aiClient: AIClient;
(async () => {
  try {
    aiClient = await AIClient.create('quiz-game');
  } catch (error) {
    console.error('Failed to initialize AI client:', error);
    process.exit(1);
  }
})();

interface QuestionFormat {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuestionSet {
  questions: QuestionFormat[];
  timestamp: number;
}

import { Message } from '@shared/api_config';

// Store question sets in memory with 5-minute expiration
const questionSets = new Map<string, QuestionSet>();

function cleanupExpiredSets() {
  const now = Date.now();
  for (const [id, set] of questionSets.entries()) {
    if (now - set.timestamp > 5 * 60 * 1000) { // 5 minutes
      questionSets.delete(id);
    }
  }
}

app.post('/api/generate-question', async (req: Request, res: Response) => {
  try {
    const { systemPrompt } = req.body;
    const gameId = req.query.gameId as string;

    // Clean up expired sets
    cleanupExpiredSets();

    // Check if we have an existing set for this game
    const existingSet = questionSets.get(gameId);
    if (existingSet && existingSet.questions.length > 0) {
      const question = existingSet.questions.shift()!;
      res.json(question);
      return;
    }

    // Generate a new set of 5 questions
    const prompt: Message = {
      role: 'user' as const,
      content: 'Generate 5 unique quiz show questions in JSON format. Each question must be from a different category:\n\n' +
        '1. History/Politics\n' +
        '2. Science/Nature\n' +
        '3. Pop Culture/Entertainment\n' +
        '4. Sports/Games\n' +
        '5. Technology/Innovation\n\n' +
        'Return a JSON array containing exactly 5 questions. Each question must be an object with this structure:\n' +
        '{\n' +
        '  "text": "question text here",\n' +
        '  "options": ["option1", "option2", "option3", "option4"],\n' +
        '  "correctAnswer": 0,\n' +
        '  "explanation": "brief explanation here"\n' +
        '}\n\n' +
        'IMPORTANT: Response must be a valid JSON array that can be parsed directly. Do not include any text outside the JSON array.'
    };

    const messages: Message[] = [
      { role: 'system' as const, content: systemPrompt },
      prompt
    ];

    console.log('Generating questions for game:', gameId);
    const response = await aiClient.get_completion(messages);
    console.log('LLM Response:', response);
    
    try {
      // Try to parse the entire response as JSON first
      let questions: QuestionFormat[];
      try {
        questions = JSON.parse(response);
        console.log('Successfully parsed response as JSON array');
      } catch (parseError) {
        console.log('Failed to parse entire response, trying to extract JSON array');
        // If that fails, try to extract JSON array
        const jsonStr = response.match(/\[[\s\S]*\]/)?.[0];
        if (!jsonStr) {
          console.error('No JSON array found in response');
          throw new Error('No JSON array found in response');
        }
        questions = JSON.parse(jsonStr);
        console.log('Successfully extracted and parsed JSON array');
      }

      // Ensure we have exactly 5 questions
      if (!Array.isArray(questions)) {
        console.error('Response is not an array:', questions);
        throw new Error('Response must be an array');
      }
      
      if (questions.length !== 5) {
        console.error('Wrong number of questions:', questions.length);
        throw new Error(`Response must contain exactly 5 questions, got ${questions.length}`);
      }
      
      // Validate each question
      questions.forEach((question, index) => {
        console.log(`Validating question ${index + 1}:`, question);
        
        if (!question.text) {
          throw new Error(`Question ${index + 1} missing text`);
        }
        if (!Array.isArray(question.options)) {
          throw new Error(`Question ${index + 1} options is not an array`);
        }
        if (question.options.length !== 4) {
          throw new Error(`Question ${index + 1} must have exactly 4 options`);
        }
        if (typeof question.correctAnswer !== 'number') {
          throw new Error(`Question ${index + 1} correctAnswer must be a number`);
        }
        if (!question.explanation) {
          throw new Error(`Question ${index + 1} missing explanation`);
        }
      });

      console.log('All questions validated successfully');
      
      // Store the questions
      const remainingQuestions = questions.slice(1);
      console.log('Storing remaining questions:', remainingQuestions.length);
      
      questionSets.set(gameId, {
        questions: remainingQuestions,
        timestamp: Date.now()
      });

      // Return the first question
      const firstQuestion = questions[0];
      console.log('Returning first question:', firstQuestion);
      res.json(firstQuestion);
    } catch (parseError) {
      console.error('Error parsing LLM response:', parseError);
      res.status(500).json({ 
        error: 'Failed to parse question data',
        details: parseError instanceof Error ? parseError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files from the frontend build directory in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
  
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log('Server running on port ' + port);
});
