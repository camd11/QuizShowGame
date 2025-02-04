import React, { useState } from 'react';
import GameContainer from './components/Game/GameContainer.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import styles from './App.module.css';

type GameMode = 'menu' | 'host' | 'join';

function App() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [gameCode, setGameCode] = useState('');
  const [inputCode, setInputCode] = useState('');

  if (mode === 'menu') {
    return (
      <ErrorBoundary>
        <div className={styles.app}>
          <div className={styles.menu}>
            <h1>Quiz Show Game</h1>
            <div className={styles.menuButtons}>
              <button 
                onClick={() => setMode('host')}
                className={styles.button}
              >
                Host New Game
              </button>
              <div className={styles.joinSection}>
                <input
                  type="text"
                  placeholder="Enter Game Code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className={styles.input}
                  maxLength={6}
                />
                <button
                  onClick={() => {
                    if (inputCode.length === 6) {
                      setGameCode(inputCode);
                      setMode('join');
                    }
                  }}
                  className={styles.button}
                  disabled={inputCode.length !== 6}
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <GameContainer 
          mode={mode} 
          gameCode={mode === 'join' ? gameCode : undefined}
        />
        <button
          onClick={() => setMode('menu')}
          className={`${styles.button} ${styles.backButton}`}
        >
          Back to Menu
        </button>
      </div>
    </ErrorBoundary>
  );
}

export default App;
