import { GameEvent, GameSession } from '../types/game';

class GameService {
  private static instance: GameService;
  private ws: WebSocket | null = null;
  private gameCode: string | null = null;
  private eventListeners: ((event: GameEvent) => void)[] = [];

  private constructor() {}

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  connect(gameCode?: string): Promise<GameSession> {
    return new Promise((resolve, reject) => {
      // For testing purposes, we'll simulate WebSocket with local state
      this.gameCode = gameCode || this.generateGameCode();
      
      const mockSession: GameSession = {
        gameCode: this.gameCode,
        players: {},
        questions: [],
        currentQuestion: 0,
        isGameOver: false,
        hostId: gameCode ? '' : 'host-' + Math.random().toString(36).substr(2, 9),
      };

      setTimeout(() => resolve(mockSession), 500);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.gameCode = null;
    this.eventListeners = [];
  }

  addEventListener(callback: (event: GameEvent) => void) {
    this.eventListeners.push(callback);
  }

  removeEventListener(callback: (event: GameEvent) => void) {
    this.eventListeners = this.eventListeners.filter(cb => cb !== callback);
  }

  // For testing: simulate receiving events
  simulateEvent(event: GameEvent) {
    this.eventListeners.forEach(callback => callback(event));
  }

  joinGame(playerId: string, name: string) {
    this.simulateEvent({
      type: 'PLAYER_JOIN',
      payload: { playerId, name }
    });
  }

  markReady(playerId: string) {
    this.simulateEvent({
      type: 'PLAYER_READY',
      payload: { playerId }
    });
  }

  startGame(hostId: string) {
    this.simulateEvent({
      type: 'GAME_START',
      payload: { hostId }
    });
  }

  submitAnswer(playerId: string, answer: any) {
    this.simulateEvent({
      type: 'PLAYER_ANSWER',
      payload: { playerId, answer }
    });
  }

  private generateGameCode(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  // Helper method to test multiplayer functionality
  async createTestGame(numPlayers: number = 2): Promise<GameSession> {
    const session = await this.connect();
    
    // Simulate other players joining
    for (let i = 1; i < numPlayers; i++) {
      const playerId = `player-${i}`;
      this.joinGame(playerId, `Test Player ${i}`);
      setTimeout(() => this.markReady(playerId), 1000 * i);
    }

    return session;
  }
}

export const gameService = GameService.getInstance();
