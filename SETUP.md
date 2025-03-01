# Development Environment Setup

## Prerequisites

1. Install Node.js (v14+) and npm (v6+)
   ```bash
   # Check versions
   node --version
   npm --version
   ```

2. Install Git
   ```bash
   # Check version
   git --version
   ```

## Initial Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd QuizShowGame
   ```

2. Create necessary environment files

   Backend (.env):
   ```bash
   # backend/.env
   PORT=3001
   NODE_ENV=development
   OPENAI_API_KEY=your_api_key_here  # Required for LLM question generation
   ```

   Frontend (.env):
   ```bash
   # frontend/.env
   REACT_APP_API_URL=http://localhost:3001
   ```

3. Install dependencies
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

## Development Server Setup

1. Start the backend server
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on http://localhost:3001
   - Provides question generation API
   - Uses LLM for You Don't Know Jack style questions
   - Includes fallback questions if API fails

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```
   The development server will start on http://localhost:3000
   - Displays the quiz game interface
   - Shows 5 questions with 30-second timer each
   - Tracks score (1000 points per correct answer)

## Game Features

### Core Functionality
- 5 questions per game
- 30-second timer per question
- Score tracking (1000 points per correct answer)
- Loading states with spinner
- Error handling with fallback questions
- Game over screen with final score

### Question Generation
- LLM-powered questions in You Don't Know Jack style
- 4 options per question
- One correct answer
- Optional explanation for correct answers
- Fallback questions if API fails

## Common Issues and Solutions

### Backend Issues

1. TypeScript Path Resolution
   ```
   Error: Cannot find module '../shared/api_config'
   ```
   Solution:
   - Check tsconfig.json paths configuration
   - Verify file exists in the correct location
   - Run `npm install` in shared directory first

2. Port Already in Use
   ```
   Error: listen EADDRINUSE: address already in use :::3001
   ```
   Solution:
   - Kill the process using the port:
     ```bash
     # On Linux/Mac
     killall node    # Stops all Node.js processes
     # OR more specifically for the backend:
     killall -9 ts-node
     
     # On Windows
     netstat -ano | findstr :3001
     taskkill /PID <PID> /F
     ```

3. OpenAI API Key Issues
   ```
   Error: Invalid API key provided
   ```
   Solution:
   - Verify OPENAI_API_KEY in backend/.env
   - Check API key permissions
   - Game will use fallback questions if API fails

### Frontend Issues

1. Module Resolution
   ```
   Error: Can't resolve './App'
   ```
   Solution:
   - Verify file extensions (.tsx vs .ts)
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     npm install
     ```

2. Type Errors
   ```
   Error: Property 'x' does not exist on type 'y'
   ```
   Solution:
   - Update type definitions
   - Check for missing imports
   - Verify TypeScript configuration

## VSCode Setup

1. Install recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - CSS Modules

2. Configure workspace settings:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "typescript.tsdk": "node_modules/typescript/lib",
     "typescript.enablePromptUseWorkspaceTsdk": true
   }
   ```

## Testing

### Manual Testing
1. Start both servers (backend and frontend)
2. Navigate to http://localhost:3000
3. Verify:
   - Questions load properly
   - Timer counts down from 30 seconds
   - Score updates for correct answers
   - Game progresses through 5 questions
   - Game over screen shows final score
   - Error states work when backend is down

### Automated Testing (To Be Implemented)
1. Run frontend tests
   ```bash
   cd frontend
   npm test
   ```

2. Run backend tests
   ```bash
   cd backend
   npm test
   ```

## Building for Production

1. Build the frontend
   ```bash
   cd frontend
   npm run build
   ```

2. Build the backend
   ```bash
   cd backend
   npm run build
   ```

## Troubleshooting

1. Clear all dependencies and reinstall
   ```bash
   # In shared, frontend, and backend directories
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. Clear TypeScript cache
   ```bash
   # In both frontend and backend directories
   rm -rf dist
   rm tsconfig.tsbuildinfo
   ```

3. Reset local environment
   ```bash
   # Stop all running servers
   # Clear port processes if needed
   # Remove all build artifacts
   rm -rf frontend/build backend/dist
   ```

## Code Style Guide

1. TypeScript
   - Use interfaces over types when possible
   - Enable strict mode
   - Use proper type annotations
   - Avoid any type

2. React
   - Use functional components
   - Use hooks for state management
   - Keep components small and focused
   - Use proper prop types

3. CSS
   - Use CSS Modules
   - Follow BEM naming convention
   - Use variables for colors and spacing

4. Git Commits
   - Follow conventional commits format
   - Keep commits small and focused
   - Write clear commit messages

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [CSS Modules Documentation](https://github.com/css-modules/css-modules)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
