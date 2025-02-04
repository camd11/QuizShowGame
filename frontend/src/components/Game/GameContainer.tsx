import React, { useState, useCallback, useEffect } from 'react';
import Question from './Question.tsx';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary.tsx';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.tsx';
import { HostContainer } from '../Host/HostContainer.tsx';
import { GameState, Question as QuestionType, PlayerAnswer, GameEvent } from '../../types/game.ts';
import { generateQuestionSet } from '../../services/questionService.ts';
import { gameService } from '../../services/gameService.ts';
import styles from './GameContainer.module.css';

interface GameContainerState extends GameState {
  questions: QuestionType[];
  loading: boolean;
  error: string | null;
}

interface Props {
  mode?: 'host' | 'join';
  gameCode?: string;
}

const GameContainer: React.FC<Props> = ({ mode = 'host', gameCode }) => {
  const [playerId] = useState(() => crypto.randomUUID());
  const [playerName] = useState(() => `Player ${Math.floor(Math.random() * 1000)}`);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isInLobby, setIsInLobby] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [gameState, setGameState] = useState<GameContainerState>({
    currentQuestion: 0,
    players: {
      [playerId]: {
        id: playerId,
        name: playerName,
        score: 0,
        isReady: false, // Start as not ready
        answers: []
      }
    },
    isGameOver: false,
    hostId: playerId,
    questions: [],
    loading: false, // Start as not loading
    error: null
  });

  const copyGameCode = useCallback(async () => {
    if (gameState.gameCode) {
      try {
        await navigator.clipboard.writeText(gameState.gameCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy game code:', err);
      }
    }
  }, [gameState.gameCode]);

  const loadQuestions = useCallback(async () => {
    try {
      const questions = await generateQuestionSet(5);
      
      if (!questions || questions.length !== 5) {
        throw new Error('Failed to load all questions');
      }
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: 0,
        questions,
        loading: false,
        error: null,
        players: Object.entries(prev.players).reduce((acc, [id, player]) => ({
          ...acc,
          [id]: {
            ...player,
            score: 0,
            answers: []
          }
        }), {})
      }));

      return true;
    } catch (error) {
      console.error('Error loading questions:', error);
      setGameState(prev => ({
        ...prev,
        error: 'Failed to load questions. Please try again.',
        loading: false
      }));
      return false;
    }
  }, []);

  const handleGameEvent = useCallback((event: GameEvent) => {
    switch (event.type) {
      case 'PLAYER_JOIN':
        setGameState(prev => ({
          ...prev,
          players: {
            ...prev.players,
            [event.payload.playerId]: {
              id: event.payload.playerId,
              name: event.payload.name,
              score: 0,
              isReady: false,
              answers: []
            }
          }
        }));
        break;
      case 'PLAYER_READY':
        setGameState(prev => ({
          ...prev,
          players: {
            ...prev.players,
            [event.payload.playerId]: {
              ...prev.players[event.payload.playerId],
              isReady: true
            }
          }
        }));
        break;
      case 'GAME_START':
        setGameState(prev => ({ ...prev, loading: true }));
        loadQuestions().then(success => {
          if (success) {
            setIsInLobby(false);
          }
        }).catch(error => {
          console.error('Failed to load questions:', error);
          setGameState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load questions. Please try again.'
          }));
        });
        break;
      case 'PLAYER_LEAVE':
        setGameState(prev => {
          const { [event.payload.playerId]: removedPlayer, ...remainingPlayers } = prev.players;
          return {
            ...prev,
            players: remainingPlayers
          };
        });
        break;
    }
  }, [loadQuestions, setIsInLobby]);

  useEffect(() => {

    const initGame = async () => {
      setIsConnecting(true);
      try {
        const session = mode === 'host' 
          ? await gameService.createTestGame()
          : await gameService.connect(gameCode);

        setGameState(prev => ({
          ...prev,
          gameCode: session.gameCode,
          hostId: session.hostId
        }));

        // Always mark host as ready in host mode
        if (mode === 'host') {
          gameService.markReady(playerId);
        } else if (mode === 'join') {
          gameService.joinGame(playerId, playerName);
        }

        gameService.addEventListener(handleGameEvent);
        setIsConnecting(false);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setGameState(prev => ({
          ...prev,
          error: 'Failed to connect to game. Please try again.'
        }));
        setIsConnecting(false);
      }
    };

    initGame();

    return () => {
      gameService.disconnect();
    };
  }, [mode, gameCode, playerId, playerName, loadQuestions, handleGameEvent]);

  useEffect(() => {
    if (mode === 'host') {
      const allPlayersReady = Object.values(gameState.players).every(p => p.isReady);
      const hasEnoughPlayers = Object.keys(gameState.players).length >= 2;
      const isNotLoading = !gameState.loading;
      
      if (allPlayersReady && hasEnoughPlayers && isNotLoading && isInLobby) {
        gameService.startGame(playerId);
      }
    }
  }, [gameState.players, mode, playerId, gameState.loading, isInLobby]);

  const handleAnswer = useCallback((answer: PlayerAnswer) => {
    setGameState(prev => {
      const isLastQuestion = prev.currentQuestion === prev.questions.length - 1;
      let points = 0;
      
      if (answer.isCorrect) {
        points = 1000;
        const timeBonus = Math.round(500 * (1 - answer.timeToAnswer / 30));
        points += Math.max(0, timeBonus);
      }

      const updatedPlayers = {
        ...prev.players,
        [playerId]: {
          ...prev.players[playerId],
          score: prev.players[playerId].score + points,
          answers: [...prev.players[playerId].answers, answer]
        }
      };

      return {
        ...prev,
        currentQuestion: isLastQuestion ? prev.currentQuestion : prev.currentQuestion + 1,
        players: updatedPlayers,
        isGameOver: isLastQuestion
      };
    });
  }, [playerId]);

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
        players: {
          [playerId]: {
            id: playerId,
            name: playerName,
            score: 0,
            isReady: true,
            answers: []
          }
        },
        isGameOver: false,
        hostId: playerId,
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
  }, [playerId, playerName]);

  if (gameState.loading) {
    return <LoadingSpinner message="Loading questions..." />;
  }

  if (mode === 'host' && gameState.questions.length > 0 && !isInLobby) {
    return (
      <ErrorBoundary>
        <HostContainer
          gameState={gameState}
          questions={gameState.questions}
          onPlayerJoin={(name) => {
            const newPlayerId = crypto.randomUUID();
            gameService.joinGame(newPlayerId, name);
          }}
          onPlayerLeave={(playerId) => {
            gameService.removePlayer(playerId);
          }}
          onPlayerAnswer={(playerId, selectedOption) => {
            const question = gameState.questions[gameState.currentQuestion];
            const answer: PlayerAnswer = {
              questionId: question.id,
              selectedOption,
              isCorrect: selectedOption === question.correctAnswer,
              timeToAnswer: 15 // Simulated time for testing
            };
            handleAnswer(answer);
          }}
          onNextQuestion={() => {
            if (!gameState.isGameOver) {
              setGameState(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1
              }));
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <h1 className={styles.title}>Quiz Show Game</h1>
        {gameState.gameCode && (
          <div className={styles.gameCodeContainer}>
            <div className={styles.gameCode}>
              Game Code: {gameState.gameCode}
            </div>
            <button 
              onClick={copyGameCode}
              className={`${styles.copyButton} ${copySuccess ? styles.copied : ''}`}
            >
              {copySuccess ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        )}
        <div className={styles.playerList}>
          {Object.values(gameState.players).map(player => (
            <div key={player.id} className={styles.playerItem}>
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.playerScore}>Score: {player.score}</span>
              {isInLobby && (
                <span className={`${styles.readyStatus} ${player.isReady ? styles.ready : ''}`}>
                  {player.isReady ? 'Ready' : 'Not Ready'}
                </span>
              )}
            </div>
          ))}
        </div>
        {!isInLobby && (
          <div className={styles.status}>
            <div>
              <p>Question: {gameState.currentQuestion + 1} / {gameState.questions.length}</p>
              <p className={styles.scoreInfo}>
                Your Score: {gameState.players[playerId]?.score || 0}
                <br />
                <small>
                  (Base: 1000 pts + Time Bonus: up to 500 pts)
                </small>
              </p>
            </div>
          </div>
        )}
        {isConnecting ? (
          <LoadingSpinner message="Connecting to game..." />
        ) : gameState.loading ? (
          <LoadingSpinner message="Loading questions..." />
        ) : isInLobby ? (
          <div className={styles.lobby}>
            <h2>Waiting for players...</h2>
            <p>Need at least 2 players to start</p>
            {!gameState.players[playerId]?.isReady && (
              <button 
                onClick={() => gameService.markReady(playerId)}
                className={styles.button}
              >
                Mark as Ready
              </button>
            )}
          </div>
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
            <p>Final Score: {gameState.players[playerId].score}</p>
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
