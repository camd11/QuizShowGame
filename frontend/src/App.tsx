import React from 'react';
import GameContainer from './components/Game/GameContainer.tsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import styles from './App.module.css';

function App() {
  return (
    <ErrorBoundary>
      <div className={styles.app}>
        <GameContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
