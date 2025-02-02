import React, { useState, useCallback, useEffect } from 'react';
import Question from './Question.tsx';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary.tsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.tsx';
import { GameState, Question as QuestionType, PlayerAnswer } from '../../types/game.ts';
import { generateQuestionSet } from '../../services/questionService.ts';
import styles from './GameContainer.module.css';

interface GameContainerState extends GameState {
  questions: QuestionType[];
  loading: boolean;
  error: string | null;
}

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameContainerState>({
    currentQuestion: 0,
    score: 0,
    isGameOver: false,
    questions: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const questions = await generateQuestionSet(5);
      setGameState(prev => ({
        ...prev,
        questions,
        loading: false
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: 'Failed to load questions. Please try again.',
        loading: false
      }));
    }
  };

  const handleAnswer = useCallback((answer: PlayerAnswer) => {
    setGameState(prev => {
      const newScore = prev.score + (answer.isCorrect ? 1000 : 0);
      const isLastQuestion = prev.currentQuestion === prev.questions.length - 1;
      
      return {
        ...prev,
        currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1,
        score: newScore,
        isGameOver: isLastQuestion
      };
    });
  }, []);

  const resetGame = useCallback(async () => {
    setGameState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    try {
      const questions = await generateQuestionSet(5);
      setGameState({
        currentQuestion: 0,
        score: 0,
        isGameOver: false,
        questions,
        loading: false,
        error: null
      });
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: 'Failed to load new questions. Please try again.',
        loading: false
      }));
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1 className={styles.title}>Quiz Show Game</h1>
        <div className={styles.status}>
          <p>Question: {gameState.currentQuestion + 1} / {gameState.questions.length}</p>
          <p>Score: {gameState.score}</p>
        </div>
        {gameState.loading ? (
          <LoadingSpinner message="Loading questions..." />
        ) : gameState.error ? (
          <div className={styles.error}>
            {gameState.error}
            <button 
              onClick={resetGame}
              className={styles.button}
            >
              Try Again
            </button>
          </div>
        ) : gameState.isGameOver ? (
          <div className={styles.gameOver}>
            <h2>Game Over!</h2>
            <p>Final Score: {gameState.score}</p>
            <button 
              onClick={resetGame}
              className={styles.button}
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className={styles.questionArea}>
            <Question
              question={gameState.questions[gameState.currentQuestion]}
              onAnswer={handleAnswer}
              timeLimit={30}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};


export default GameContainer;
