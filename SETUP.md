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
   OPENAI_API_KEY=your_api_key_here
   ```

   Frontend (.env):
   ```bash
   # frontend/.env
   REACT_APP_API_URL=http://localhost:3001
   ```

3. Install dependencies
   ```bash
   # Install backend dependencies
   cd backend
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

2. Start the frontend development server
   ```bash
   cd frontend
   npm start
   ```
   The development server will start on http://localhost:3000

## Common Issues and Solutions

### Backend Issues

1. TypeScript Path Resolution
   ```
   Error: Cannot find module '../shared/api_config'
   ```
   Solution:
   - Check tsconfig.json paths configuration
   - Verify file exists in the correct location
   - Run `npm install` to update dependencies

2. Port Already in Use
   ```
   Error: listen EADDRINUSE: address already in use :::3001
   ```
   Solution:
   - Kill the process using the port:
     ```bash
     # On Linux/Mac
     lsof -i :3001
     kill -9 <PID>
     
     # On Windows
     netstat -ano | findstr :3001
     taskkill /PID <PID> /F
     ```

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

## Git Workflow

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push your changes
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

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
   # In both frontend and backend directories
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
