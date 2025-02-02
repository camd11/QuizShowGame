# Quiz Show Game

A multiplayer quiz show game in the style of You Don't Know Jack, using LLM for dynamic content generation.

## Project Structure

```
.
├── api_config.py (Original API config - being migrated to TypeScript)
├── backend/
│   ├── server.ts (Express server handling LLM integration)
│   └── tsconfig.json (TypeScript configuration for backend)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Game/
│   │   │       ├── GameContainer.tsx (Main game logic and UI)
│   │   │       ├── Question.tsx (Question component)
│   │   │       └── Question.module.css (Question styling)
│   │   ├── services/
│   │   │   └── questionService.ts (API integration for question generation)
│   │   └── types/
│   │       ├── game.ts (Game-related TypeScript interfaces)
│   │       └── css.d.ts (CSS modules type declarations)
└── shared/
    └── api_config.ts (Shared TypeScript implementation of API client)
```

## Setup Instructions

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
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
- Express server with TypeScript
- Mock LLM integration (currently returns hardcoded responses)
- REST API endpoint for question generation
- CORS enabled for local development

### Frontend
- React with TypeScript
- Component-based architecture
- CSS Modules for styling
- Service layer for API communication

### Shared
- TypeScript implementation of API client
- Mock LLM responses for development
- Conversation history tracking
- Logging functionality

## Current Issues and TODOs

1. **Backend Issues**
   - Need to implement proper error handling for LLM API failures
   - Logging directory structure needs to be created automatically
   - Add request rate limiting
   - Add proper environment variable handling

2. **Frontend Issues**
   - Question component needs proper error state UI
   - Add loading animations for API calls
   - Implement proper score calculation based on answer time
   - Add sound effects and animations
   - Add multiplayer support

3. **API Integration**
   - Complete migration from Python to TypeScript
   - Implement proper OpenAI API integration
   - Add retry logic for failed API calls
   - Add response validation

4. **Testing**
   - Add unit tests for components
   - Add integration tests for API calls
   - Add end-to-end testing

## Next Steps

1. Implement proper LLM integration:
   - Replace mock responses with real API calls
   - Add proper error handling
   - Implement retry logic

2. Add multiplayer support:
   - Implement WebSocket server
   - Add room management
   - Add player synchronization
   - Add real-time score updates

3. Enhance game features:
   - Add different question types
   - Implement scoring system based on time
   - Add sound effects and animations
   - Add leaderboard

4. Improve error handling:
   - Add proper error boundaries
   - Implement retry mechanisms
   - Add user-friendly error messages

## Development Guidelines

1. Follow TypeScript best practices
2. Use CSS Modules for styling
3. Follow SOLID principles
4. Keep components small and focused
5. Add proper documentation
6. Add unit tests for new features

## Environment Setup

The project requires:
- Node.js 14+
- npm 6+
- TypeScript 4+

## API Documentation

### Question Generation Endpoint
```
POST /api/generate-question
Content-Type: application/json

Request Body:
{
  "systemPrompt": string,
  "format": {
    "text": "string - the question text",
    "options": "array of 4 strings - possible answers",
    "correctAnswer": "number - index of correct answer (0-3)",
    "explanation": "string - brief explanation of the correct answer"
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

## Known Issues

1. Frontend build issues:
   - Need to resolve module resolution errors
   - Add proper TypeScript path aliases
   - Fix CSS module type declarations

2. Backend configuration:
   - Need to properly configure TypeScript paths
   - Add proper environment variable handling
   - Configure proper logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

ISC License
