export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
  answers: PlayerAnswer[];
}

export interface GameState {
  currentQuestion: number;
  players: Record<string, Player>;
  isGameOver: boolean;
  hostId?: string;
  gameCode?: string;
}

export interface PlayerAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeToAnswer: number;
}

export interface GameSession {
  gameCode: string;
  players: Record<string, Player>;
  questions: Question[];
  currentQuestion: number;
  isGameOver: boolean;
  startTime?: number;
  hostId: string;
}

export type GameEvent = 
  | { type: 'PLAYER_JOIN'; payload: { playerId: string; name: string } }
  | { type: 'PLAYER_READY'; payload: { playerId: string } }
  | { type: 'PLAYER_ANSWER'; payload: { playerId: string; answer: PlayerAnswer } }
  | { type: 'GAME_START'; payload: { hostId: string } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'GAME_OVER' };
