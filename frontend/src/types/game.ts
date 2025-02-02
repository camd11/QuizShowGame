export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  isGameOver: boolean;
}

export interface PlayerAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeToAnswer: number;
}
