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

3. Get OpenRouter API Key
   - Sign up at https://openrouter.ai/
   - Create an API key (required for question generation)
   - Keep this key secure and never commit it

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
   OPENAI_API_KEY=your_openrouter_api_key_here  # Required for question generation
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
   - Uses OpenRouter API for You Don't Know Jack style questions
   - Requires valid API key for operation
   - Implements question caching per game session

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```
   The development server will start on http://localhost:3000
   - Displays the quiz game interface
   - Shows 5 questions with 30-second timer each
   - Tracks score (1000 points per correct answer)
   - Handles loading and error states

## Game Features

### Core Functionality
- 5 questions per game
- 30-second timer per question
- Score tracking (1000 points per correct answer)
- Answer explanations with 6-second display
- Smooth transitions between questions
- Loading states with spinner
- Error handling with user feedback
- Game over screen with final score

### Question Generation
- LLM-powered questions in You Don't Know Jack style
- 4 options per question
- One correct answer
- Questions from diverse categories:
  - History/Politics
  - Science/Nature
  - Pop Culture/Entertainment
  - Sports/Games
  - Technology/Innovation
- Witty explanations for correct answers
- Dynamic content through OpenRouter API

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
     ```

3. OpenRouter API Key Issues
   ```
   Error: Failed to generate question
   ```
   Solution:
   - Verify OPENAI_API_KEY in backend/.env
   - Check API key permissions on OpenRouter
   - Ensure API key is properly formatted
   - Check OpenRouter dashboard for usage limits

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
1. Kill any existing Node.js processes:
   ```bash
   # On Linux/Mac
   killall node    # Stops all Node.js processes
   # OR more specifically:
   killall -9 ts-node
   ```

2. Start both servers (backend and frontend)
3. Navigate to http://localhost:3000
3. Verify:
   - Questions load properly
   - Timer counts down from 30 seconds
   - Score updates for correct answers
   - Answer explanations display for 6 seconds
   - Smooth transitions between questions
   - Game progresses through 5 questions
   - Game over screen shows final score
   - Error states show user-friendly messages

### Automated Testing (To Be Implemented)
1. Kill any existing Node.js processes:
   ```bash
   # On Linux/Mac
   killall node    # Stops all Node.js processes
   # OR more specifically:
   killall -9 ts-node
   ```

2. Run frontend tests:
   ```bash
   cd frontend
   npm test
   ```

3. Run backend tests:
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
   killall node  # On Linux/Mac
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
   - Use cubic-bezier for smooth animations
   - Implement proper transition timing

4. Git Commits
   - Follow conventional commits format
   - Keep commits small and focused
   - Write clear commit messages
   - Never commit API keys or sensitive data
