# Quiz Show Game

A multiplayer quiz show game in the style of You Don't Know Jack, using LLM for dynamic content generation.

## Features

### Core Game Features
- 5 questions per game with 30-second timer per question
- Score tracking (1000 points per correct answer)
- Loading states with spinner animation
- Error handling with user-friendly messages
- Game over screen with final score
- Responsive UI with CSS Modules

### Question Generation
- LLM-powered questions in You Don't Know Jack style
- 4 options per question with one correct answer
- Witty explanations for correct answers
- Dynamic content generation through OpenRouter API

## Project Structure

```
.
├── backend/
│   ├── server.ts (Express server with LLM integration)
│   └── tsconfig.json (TypeScript configuration)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorBoundary/ (Error handling components)
│   │   │   ├── LoadingSpinner/ (Loading state components)
│   │   │   └── Game/
│   │   │       ├── GameContainer.tsx (Game logic and state)
│   │   │       ├── Question.tsx (Question display and timer)
│   │   │       └── Question.module.css (Question styling)
│   │   ├── services/
│   │   │   └── questionService.ts (Question generation API)
│   │   └── types/
│   │       ├── game.ts (Game type definitions)
│   │       └── css.d.ts (CSS module declarations)
└── shared/
    └── api_config.ts (Shared API configuration)
```

## Prerequisites

1. OpenRouter API Key
   - Sign up at https://openrouter.ai/
   - Create an API key
   - This is required for question generation

## Setup Instructions

1. Install dependencies:
```bash
# Install shared dependencies
cd shared
npm install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Configure environment variables:

Backend (.env):
```bash
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openrouter_api_key_here  # Required for question generation
```

Frontend (.env):
```bash
REACT_APP_API_URL=http://localhost:3001
```

3. Start the backend server (runs on port 3001):
```bash
cd backend
npm run dev
```

4. Start the frontend development server (runs on port 3000):
```bash
cd frontend
npm start
```

## Current Implementation

### Backend
✅ Express server with TypeScript
✅ OpenRouter API integration for question generation
✅ Proper error handling and validation
✅ Environment variable configuration
✅ CORS enabled for local development

### Frontend
✅ React with TypeScript
✅ Component-based architecture
✅ CSS Modules for styling
✅ Loading states with spinner
✅ Error boundaries
✅ Timer functionality
✅ Score tracking

### Shared
✅ TypeScript implementation of API client
✅ Shared type definitions
✅ API configuration

## Upcoming Features

1. Enhanced Game Features:
   - Time-based scoring system
   - Sound effects and animations
   - Question categories
   - Difficulty levels
   - Answer explanations

2. Multiplayer Support:
   - WebSocket server
   - Room management
   - Player synchronization
   - Real-time score updates

3. User Experience:
   - Keyboard controls
   - Mobile responsiveness
   - Progress indicators
   - Game statistics
   - Leaderboard

## Development Guidelines

1. TypeScript Best Practices:
   - Use interfaces over types
   - Enable strict mode
   - Proper type annotations
   - No any types

2. React Guidelines:
   - Functional components
   - React hooks for state
   - Small, focused components
   - Proper prop types

3. CSS Guidelines:
   - CSS Modules
   - BEM naming convention
   - Variables for colors/spacing
   - Mobile-first approach

4. Testing Guidelines:
   - Unit tests for components
   - Integration tests for API
   - End-to-end testing
   - Test coverage reporting

## Environment Requirements

- Node.js 14+
- npm 6+
- TypeScript 4+
- Modern web browser with JavaScript enabled
- OpenRouter API key

## API Documentation

### Question Generation
```
POST /api/generate-question
Content-Type: application/json

Request:
{
  "systemPrompt": string,  // You Don't Know Jack style prompt
  "format": {
    "text": string,       // Question text
    "options": string[],  // 4 possible answers
    "correctAnswer": number,  // Index (0-3)
    "explanation": string    // Why answer is correct
  }
}

Response:
{
  "text": string,
  "options": string[],
  "correctAnswer": number,
  "explanation": string
}
```

## Troubleshooting

1. API Key Issues:
   ```
   Error: Failed to generate question
   ```
   - Verify OPENAI_API_KEY in backend/.env
   - Check API key permissions on OpenRouter
   - Ensure API key is properly formatted

2. Port Already in Use:
   ```
   Error: listen EADDRINUSE: address already in use :::3001
   ```
   Solution:
   ```bash
   # On Linux/Mac
   killall node    # Stops all Node.js processes
   # OR more specifically for the backend:
   killall -9 ts-node
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See DEVELOPMENT.md for detailed development guidelines and SETUP.md for environment setup instructions.

## License

ISC License
