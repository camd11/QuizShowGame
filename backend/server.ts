import express, { Request, Response } from 'express';
import { AIClient } from '../shared/api_config';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;

// Initialize AI client
const aiClient = new AIClient('quiz-game');

app.use(cors());
app.use(express.json());

interface QuestionFormat {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Message {
  role: string;
  content: string;
}

app.post('/api/generate-question', async (req: Request, res: Response) => {
  try {
    const { systemPrompt } = req.body;

    const prompt: Message = {
      role: "user",
      content: "Generate a quiz show question in JSON format with the following structure: " +
        "{\n" +
        '  "text": "the question text",\n' +
        '  "options": ["option1", "option2", "option3", "option4"],\n' +
        '  "correctAnswer": 0,\n' + // index of correct answer
        '  "explanation": "brief explanation of the answer"\n' +
        "}\n\n" +
        "Make sure the response is valid JSON and follows this exact format."
    };

    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      prompt
    ];

    const response = await aiClient.get_completion(messages);
    
    try {
      // Extract JSON from the response
      const jsonStr = response.match(/\{[\s\S]*\}/)?.[0];
      if (!jsonStr) {
        throw new Error('No JSON found in response');
      }
      
      const questionData: QuestionFormat = JSON.parse(jsonStr);
      
      // Validate the response format
      if (!questionData.text || 
          !Array.isArray(questionData.options) || 
          questionData.options.length !== 4 ||
          typeof questionData.correctAnswer !== 'number' ||
          !questionData.explanation) {
        throw new Error('Invalid question format');
      }

      res.json(questionData);
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
  console.log(`Server running on port ${port}`);
});
