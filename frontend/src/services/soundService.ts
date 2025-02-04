// Base64-encoded WAV files for small file size and instant playback
const CORRECT_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT18=';
const INCORRECT_SOUND = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT18=';

class SoundService {
  private correctAudio: HTMLAudioElement;
  private incorrectAudio: HTMLAudioElement;

  constructor() {
    this.correctAudio = new Audio(CORRECT_SOUND);
    this.incorrectAudio = new Audio(INCORRECT_SOUND);
  }

  playCorrect() {
    this.correctAudio.currentTime = 0;
    this.correctAudio.play().catch(err => console.error('Error playing sound:', err));
  }

  playIncorrect() {
    this.incorrectAudio.currentTime = 0;
    this.incorrectAudio.play().catch(err => console.error('Error playing sound:', err));
  }
}

export const soundService = new SoundService();
