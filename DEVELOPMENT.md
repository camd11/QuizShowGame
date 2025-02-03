# Development Notes

## Current Development Status

### Frontend Status
- ✅ Game UI fully implemented with question display, timer, and score tracking
- ✅ Error boundary implemented with user-friendly error messages
- ✅ Loading spinner for API calls
- ✅ CSS Modules for styling
- ✅ TypeScript types defined and implemented
- ✅ Proper error handling with retry options

Current frontend features:
1. 5-question game format
2. 30-second timer per question
3. Score tracking (1000 points per correct answer)
4. Loading states with spinner
5. Error handling with user feedback
6. Game over screen with final score
7. Responsive design with CSS Modules

### Backend Status
- ✅ Express server with TypeScript
- ✅ OpenRouter API integration for question generation
- ✅ LLM integration with system prompts
- ✅ Question caching with game sessions
- ✅ CORS configured for development
- ✅ Environment variables configured

Current backend features:
1. Question generation with You Don't Know Jack style prompts
2. Question caching per game session
3. Error handling with proper responses
4. Environment variable configuration
5. TypeScript path resolution working

## Technical Details

### Game Logic
```typescript
// Game state structure
interface GameState {
  currentQuestion: number;  // Tracks current question (1-5)
  score: number;           // 1000 points per correct answer
  isGameOver: boolean;     // True when all questions answered
}

// Container state with loading/error handling
interface GameContainerState extends GameState {
  questions: QuestionType[];  // Array of 5 questions
  loading: boolean;          // Shows spinner when true
  error: string | null;      // Shows error message if present
}
```

### API Integration
```typescript
// Question format
interface Question {
  id: string;              // Unique identifier
  text: string;            // Question text
  options: string[];       // Array of 4 answer options
  correctAnswer: number;   // Index of correct answer (0-3)
  explanation?: string;    // Optional explanation of answer
}

// API response format
interface QuestionResponse {
  text: string;            // LLM-generated question
  options: string[];       // 4 possible answers
  correctAnswer: number;   // Correct answer index
  explanation: string;     // Why the answer is correct
}
```

## Development Environment

### Required VSCode Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- CSS Modules

### Recommended VSCode Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Build and Development Process

### Development Workflow
1. Get OpenRouter API Key:
   - Sign up at https://openrouter.ai/
   - Create an API key
   - Add key to backend/.env

2. Start backend server:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on http://localhost:3001

3. Start frontend development server:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Application runs on http://localhost:3000

### Verified Features
1. Question Generation:
   - OpenRouter API generates witty questions
   - Questions follow You Don't Know Jack style
   - 4 options per question with one correct answer
   - Questions from diverse categories

2. Game Flow:
   - 5 questions per game
   - 30-second timer per question
   - Score tracking (1000 points per correct)
   - Game over screen with final score

3. Error Handling:
   - Loading states with spinner
   - Error messages for API failures
   - User-friendly error messages
   - Error boundary for component errors

## Testing Strategy

### Manual Testing Completed
✅ Core game flow
✅ Score calculation
✅ Timer functionality
✅ Error handling
✅ Loading states
✅ Question generation
✅ Game completion

### Unit Tests (To Be Implemented)
- Component testing with React Testing Library
- Service layer testing with Jest
- API client testing with Mock Service Worker

### Integration Tests (To Be Implemented)
- API endpoint testing
- Component integration testing
- State management testing

### End-to-End Tests (To Be Implemented)
- User flow testing with Cypress
- API integration testing
- Error scenario testing

## Performance Considerations

### Current Performance
✅ Quick question loading with caching
✅ Smooth transitions between questions
✅ Responsive UI
✅ Proper error states
✅ Efficient state updates

### Potential Optimizations
1. Implement question pre-fetching
2. Add request debouncing
3. Optimize bundle size
4. Add performance monitoring

## Security Considerations

### Current Security Measures
✅ Environment variables for API keys
✅ CORS configured properly
✅ Basic error message sanitization
✅ API keys properly gitignored

### Recommended Security Improvements
1. Add input validation
2. Implement rate limiting
3. Add API key rotation
4. Enhance error handling

## Deployment Considerations

### Required Environment Variables
```bash
# Backend
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openrouter_api_key  # Required for question generation

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

### Production Build Process
1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build backend:
   ```bash
   cd backend
   npm run build
   ```

### Deployment Checklist
- [ ] OpenRouter API key configured
- [ ] Environment variables set
- [ ] Build process verified
- [ ] API endpoints configured
- [ ] CORS settings updated
- [ ] Error logging configured
- [ ] Performance monitoring setup

## API Troubleshooting

### Common Issues

1. API Key Not Working:
   ```
   Error: Failed to generate question
   ```
   Solutions:
   - Verify OPENAI_API_KEY in backend/.env
   - Check API key permissions on OpenRouter
   - Ensure API key is properly formatted

2. Server Port Issues:
   ```
   Error: listen EADDRINUSE: address already in use :::3001
   ```
   Solution:
   ```bash
   # On Linux/Mac
   killall node    # Stops all Node.js processes
   # OR more specifically:
   killall -9 ts-node
   ```

3. API Response Format:
   - Ensure system prompt follows You Don't Know Jack style
   - Validate response contains all required fields
   - Check question format matches expected schema
