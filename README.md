# Quiz Show Game

A multiplayer quiz show game in the style of You Don't Know Jack, using LLM for dynamic content generation.

## Features

### Core Game Features
- 5 questions per game with 30-second timer per question
- Score tracking (1000 points per correct answer + time bonus)
- Answer explanations with 6-second display time
- Smooth transitions between questions with animations
- Loading states with spinner animation
- Error handling with user-friendly messages
- Game over screen with final score
- Responsive UI with CSS Modules

### Question Generation
- LLM-powered questions in You Don't Know Jack style
- 4 options per question with one correct answer
- Questions from diverse categories:
  - History/Politics
  - Science/Nature
  - Pop Culture/Entertainment
  - Sports/Games
  - Technology/Innovation
- Witty explanations for correct answers
- Dynamic content generation through OpenRouter API

### Upcoming Multiplayer Features
1. Host Experience:
   - Full-screen display optimized for streaming
   - Discord integration for screen sharing
   - Player status and score overlays
   - Game flow controls
   - Built-in player simulation for testing

2. Player Experience:
   - Mobile-optimized interface
   - Easy join process with game codes
   - Touch-friendly answer buttons
   - Real-time score updates
   - Connection status indicators

## How to Play

### As a Host
1. Start a new game session
2. Share your screen in Discord
3. Share the game code with players
4. Use simulation tabs to test player experience
5. Control game flow and monitor player status

### As a Player
1. Open the game on your mobile device
2. Enter the game code from the host
3. Wait for the game to start
4. Answer questions using the touch interface
5. Watch your score update in real-time

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
│   │   │       ├── Question.tsx (Question display and transitions)
│   │   │       └── Question.module.css (Question and animation styling)
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

2. For Hosting:
   - Discord installed
   - Stable internet connection
   - Screen resolution 1920x1080 or higher (recommended)
   - Audio output properly configured

3. For Playing:
   - Modern mobile browser
   - Stable internet connection
   - Touch screen device
   - Portrait orientation supported

## Setup Instructions

### Prerequisites
1. Node.js and npm installed
2. OpenRouter API Key (for question generation)
   - Sign up at https://openrouter.ai/
   - Create an API key
   - Add to backend/.env

### Installation
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

## Discord Setup Guide

### For Hosts
1. Create or join a Discord server
2. Start a voice channel
3. Click "Share Screen"
4. Select the browser window with the game
5. Enable "Stream Game Audio"
6. Set quality to 1080p/60fps if available

### Audio Setup
1. Set Discord as default audio output
2. Configure game volume in Discord
3. Test audio with players
4. Adjust based on feedback

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

3. Mobile Device Issues:
   - Enable screen rotation
   - Clear browser cache
   - Check internet connection
   - Update browser if needed

4. Discord Streaming Issues:
   - Check internet bandwidth
   - Lower stream quality if needed
   - Verify audio routing
   - Update Discord client

## License

ISC License
