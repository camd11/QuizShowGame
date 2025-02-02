# Development Notes

## Current Development Status

### Frontend Status
- Basic game UI implemented
- Question component with timer
- Score tracking
- Basic error handling
- CSS Modules integration
- TypeScript types defined

Current frontend issues:
1. Module resolution errors in build process
2. Need to implement proper error boundaries
3. Missing loading states for API calls
4. CSS modules type declarations need fixing

### Backend Status
- Express server setup with TypeScript
- Basic API endpoint for question generation
- Mock LLM integration
- CORS configured for development

Current backend issues:
1. TypeScript path resolution needs fixing
2. Logging system needs proper setup
3. Environment variables not properly configured
4. Need to implement proper error handling

## Technical Debt

### Frontend
1. Component Structure:
   - GameContainer.tsx is handling too many responsibilities
   - Need to extract game logic into custom hooks
   - Need to implement proper state management
   - Missing error boundaries

2. Type Definitions:
   - Some any types need to be properly typed
   - Need to add proper type guards
   - Missing proper error types

3. Testing:
   - No unit tests implemented
   - No integration tests
   - No end-to-end tests

### Backend
1. API Implementation:
   - Mock LLM responses need to be replaced with real API calls
   - Need proper request validation
   - Missing rate limiting
   - No request/response logging

2. Error Handling:
   - Basic error handling implemented
   - Need proper error types
   - Missing retry logic
   - Need proper error logging

3. Configuration:
   - Hard-coded values need to be moved to environment variables
   - Missing proper configuration validation
   - Need proper TypeScript path aliases

## Implementation Details

### Game Logic
```typescript
// Current game state structure
interface GameState {
  currentQuestion: number;
  score: number;
  isGameOver: boolean;
}

// Extended game state with loading and error handling
interface GameContainerState extends GameState {
  questions: QuestionType[];
  loading: boolean;
  error: string | null;
}
```

### API Integration
```typescript
// Current question format
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// API response format
interface QuestionResponse {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
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
1. Start backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Current Build Issues
1. Frontend:
   ```
   Module not found: Error: Can't resolve './App' in '/frontend/src'
   ```
   Potential fixes:
   - Check file extensions (.tsx vs .ts)
   - Verify import paths
   - Check TypeScript configuration

2. Backend:
   ```
   File '/shared/api_config.ts' is not under 'rootDir'
   ```
   Potential fixes:
   - Update tsconfig.json rootDir
   - Configure proper path aliases
   - Move shared code to appropriate location

## Testing Strategy

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

### Current Performance Issues
1. No caching implemented
2. No request debouncing
3. No response memoization
4. Large bundle size

### Planned Optimizations
1. Implement proper code splitting
2. Add request caching
3. Optimize bundle size
4. Add performance monitoring

## Security Considerations

### Current Security Issues
1. No input sanitization
2. No rate limiting
3. No API key rotation
4. No proper error message sanitization

### Planned Security Improvements
1. Implement proper input validation
2. Add rate limiting
3. Implement API key rotation
4. Add proper error handling

## Deployment Considerations

### Required Environment Variables
```bash
# Backend
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_api_key

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
- [ ] Environment variables configured
- [ ] Build process verified
- [ ] API endpoints configured
- [ ] CORS settings updated
- [ ] Error logging configured
- [ ] Performance monitoring setup
