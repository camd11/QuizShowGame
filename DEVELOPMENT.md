# Development Notes

## Current Development Status

### Frontend Status
- ✅ Game UI fully implemented with question display, timer, and score tracking
- ✅ Error boundary implemented with user-friendly error messages
- ✅ Loading spinner for API calls
- ✅ CSS Modules for styling
- ✅ TypeScript types defined and implemented
- ✅ Proper error handling with retry options
- ✅ Question state management fixed for multi-question progression

Current frontend features:
1. 5-question game format
2. 30-second timer per question
3. Score tracking with time-based bonus:
   - Base: 1000 points per correct answer
   - Time bonus: Up to 500 points based on speed
   - Formula: bonus = 500 * (1 - timeToAnswer/30)
4. Sound effects for correct/incorrect answers
5. Answer explanations with 6-second display
6. Smooth question transitions with animations
7. Loading states with spinner
8. Error handling with user feedback
9. Game over screen with final score
10. Responsive design with CSS Modules

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

## Multiplayer Implementation Plan

### Architecture Overview

1. Host Interface:
   ```typescript
   interface HostView {
     mainDisplay: {
       currentQuestion: Question;
       timer: number;
       scores: Record<string, number>;
       playerAnswers: Record<string, boolean>;
     };
     playerTabs: PlayerTab[];  // For testing/simulation
     screenShareStatus: boolean;
   }

   interface PlayerTab {
     id: string;
     name: string;
     isMinimized: boolean;
     view: PlayerView;
   }
   ```

2. Player Interface (Mobile):
   ```typescript
   interface PlayerView {
     currentQuestion: {
       text: string;
       options: string[];
     };
     answerInput: {
       selectedOption: number | null;
       isLocked: boolean;
       timeRemaining: number;
     };
     score: number;
     playerStatus: 'waiting' | 'answering' | 'answered';
   }
   ```

3. Game Session:
   ```typescript
   interface GameSession {
     hostId: string;
     gameCode: string;
     players: Record<string, Player>;
     currentQuestion: number;
     isActive: boolean;
     screenShareUrl?: string;  // For Discord integration
   }
   ```

### Implementation Phases

#### Phase 1: Host Interface
1. Main Display:
   - Full-screen question display
   - Timer and score tracking
   - Player status indicators
   - Screen share button/status
   - Discord integration helper

2. Player Simulation Tabs:
   - Tab management system
   - Add/Remove tab controls
   - Minimize/Maximize functionality
   - Simulated mobile view
   - Independent answer inputs

3. Host Controls:
   - Start/pause game
   - Kick player option
   - Reset game
   - Share screen instructions
   - Volume controls

#### Phase 2: Mobile Player Interface
1. Responsive Design:
   - Mobile-first layout
   - Touch-optimized controls
   - Portrait orientation lock
   - PWA support for app-like experience

2. Player Features:
   - Simple join process
   - Clear answer buttons
   - Score display
   - Answer confirmation
   - Connection status
   - Rejoin capability

3. Mobile Optimizations:
   - Minimal data transfer
   - Battery efficient
   - Offline recovery
   - Keep screen active

#### Phase 3: Integration
1. Screen Sharing:
   - Discord integration guide
   - Screen share detection
   - Audio routing setup
   - Performance optimization
   - Fallback options

2. Networking:
   - WebSocket connections
   - State synchronization
   - Latency compensation
   - Reconnection handling
   - Player limit management

### Testing Implementation

1. Host Simulation:
   ```typescript
   interface TestControls {
     addPlayerTab(): void;
     removePlayerTab(id: string): void;
     simulateDisconnect(id: string): void;
     simulateLatency(ms: number): void;
     toggleScreenShare(): void;
   }
   ```

2. Player Tab System:
   ```typescript
   class PlayerTabManager {
     tabs: Map<string, PlayerTab>;
     
     createTab(): PlayerTab;
     minimizeTab(id: string): void;
     maximizeTab(id: string): void;
     closeTab(id: string): void;
     simulateAnswer(id: string, answer: number): void;
   }
   ```

3. Test Scenarios:
   - Multiple players joining/leaving
   - Screen share interruptions
   - Network issues
   - Browser compatibility
   - Mobile device testing

### Mobile-First Design

1. Player View Components:
   ```typescript
   interface MobileComponents {
     QuestionDisplay: React.FC<{
       question: string;
       options: string[];
       timeRemaining: number;
     }>;
     
     AnswerButtons: React.FC<{
       options: string[];
       onSelect: (index: number) => void;
       isLocked: boolean;
     }>;
     
     StatusBar: React.FC<{
       score: number;
       connection: string;
       playerCount: number;
     }>;
   }
   ```

2. Mobile Styling:
   ```css
   /* Mobile-specific styles */
   .answerButton {
     min-height: 60px;
     width: 100%;
     margin: 8px 0;
     padding: 16px;
     touch-action: manipulation;
   }

   .questionText {
     font-size: 1.2em;
     line-height: 1.4;
     padding: 16px;
   }

   /* Ensure no zoom on input focus */
   @viewport {
     width: device-width;
     zoom: 1;
     max-zoom: 1;
   }
   ```

### Development Workflow

1. Host Development:
   - Implement main display
   - Add player tab system
   - Create screen share helpers
   - Test with simulated players

2. Player Development:
   - Create mobile interface
   - Implement answer system
   - Add connection handling
   - Test on various devices

3. Integration:
   - Connect host and players
   - Test latency handling
   - Verify synchronization
   - Document Discord setup

### Next Steps

1. Host Interface:
   - [ ] Create main display layout
   - [ ] Implement player tab system
   - [ ] Add screen share detection
   - [ ] Build Discord helper

2. Player Interface:
   - [ ] Design mobile layout
   - [ ] Create answer input system
   - [ ] Implement connection handling
   - [ ] Add PWA support

3. Testing:
   - [ ] Build tab simulation
   - [ ] Test network scenarios
   - [ ] Verify mobile compatibility
   - [ ] Document test cases

## Technical Details

### Game Logic
```typescript
// Game state structure
interface GameState {
  currentQuestion: number;  // Tracks current question (1-5)
  score: number;           // 1000 points per correct answer
  isGameOver: boolean;     // True when all questions answered
  showExplanation: boolean; // Controls explanation visibility
  isExiting: boolean;      // Controls transition animations
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
1. Kill any existing Node.js processes:
   ```bash
   # On Linux/Mac
   killall node    # Stops all Node.js processes
   # OR more specifically:
   killall -9 ts-node
   ```

2. Get OpenRouter API Key:
   - Sign up at https://openrouter.ai/
   - Create an API key
   - Add key to backend/.env

3. Start backend server:
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
   - Detailed explanations for each answer

2. Game Flow:
   - 5 questions per game
   - 30-second timer per question
   - Score tracking (1000 points per correct)
   - Answer explanations with 6-second display
   - Smooth transitions between questions
   - Game over screen with final score

3. Error Handling:
   - Loading states with spinner
   - Error messages for API failures
   - User-friendly error messages
   - Error boundary for component errors

## Testing Strategy

### Manual Testing
1. Host Testing:
   - Screen sharing setup
   - Player tab management
   - Game flow control
   - Audio/visual sync

2. Player Testing:
   - Mobile responsiveness
   - Answer submission
   - Connection stability
   - Device compatibility

### Automated Testing
1. Unit Tests:
   - Component rendering
   - Game logic
   - State management
   - Event handling

2. Integration Tests:
   - Host-player communication
   - Screen share detection
   - Tab simulation
   - Network scenarios

### Performance Testing
1. Network:
   - Latency handling
   - Connection recovery
   - State synchronization
   - Data efficiency

2. Device:
   - Mobile battery usage
   - Memory management
   - Screen wake locks
   - Touch response

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
