import React, { useState, useCallback, useEffect } from 'react';
import Question from './Question';
import { GameState, Question as QuestionType, PlayerAnswer } from '../../types/game';
import { generateQuestionSet } from '../../services/questionService';

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
    <div className="game-container" style={styles.container}>
      <h1 style={styles.title}>Quiz Show Game</h1>
      <div style={styles.status}>
        <p>Question: {gameState.currentQuestion + 1} / {gameState.questions.length}</p>
        <p>Score: {gameState.score}</p>
      </div>
      {gameState.loading ? (
        <div style={styles.loading}>Loading questions...</div>
      ) : gameState.error ? (
        <div style={styles.error}>
          {gameState.error}
          <button 
            onClick={resetGame}
            style={styles.button}
          >
            Try Again
          </button>
        </div>
      ) : gameState.isGameOver ? (
        <div style={styles.gameOver}>
          <h2>Game Over!</h2>
          <p>Final Score: {gameState.score}</p>
          <button 
            onClick={resetGame}
            style={styles.button}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div style={styles.questionArea}>
          <Question
            question={gameState.questions[gameState.currentQuestion]}
            onAnswer={handleAnswer}
            timeLimit={30}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center' as const,
    color: '#2c3e50',
    marginBottom: '30px',
  },
  status: {
    display: 'flex' as const,
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  questionArea: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  gameOver: {
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '1.2em',
    color: '#666',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  error: {
    textAlign: 'center' as const,
    padding: '40px',
    backgroundColor: '#fff3f3',
    borderRadius: '10px',
    color: '#dc3545',
    marginBottom: '20px',
  },
};

export default GameContainer;
