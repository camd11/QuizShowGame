import React, { useState, useEffect, useCallback } from 'react';
import { Question as QuestionType, PlayerAnswer } from '../../types/game';
import styles from './Question.module.css';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: PlayerAnswer) => void;
  timeLimit?: number;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, timeLimit = 30 }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime] = useState(Date.now());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const [currentAnswer, setCurrentAnswer] = useState<PlayerAnswer | null>(null);

  // Reset all states when question changes
  useEffect(() => {
    setSelectedOption(null);
    setTimeLeft(timeLimit);
    setShowExplanation(false);
    setIsExiting(false);
    setIsAnswered(false);
    setCurrentAnswer(null);
  }, [question, timeLimit]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return;

    const answer: PlayerAnswer = {
      questionId: question.id,
      selectedOption: optionIndex,
      isCorrect: optionIndex === question.correctAnswer,
      timeToAnswer: (Date.now() - startTime) / 1000
    };

    setCurrentAnswer(answer);
    setIsAnswered(true);
    setSelectedOption(optionIndex);
    setShowExplanation(true);
  }, [question.id, question.correctAnswer, startTime, isAnswered]);

  // Handle answer submission and transitions
  useEffect(() => {
    if (!isAnswered || !currentAnswer) return;

    let mounted = true;
    let transitionTimer: NodeJS.Timeout;

    // Show explanation immediately
    setShowExplanation(true);

    // Wait for next frame to ensure explanation is rendered
    requestAnimationFrame(() => {
      if (!mounted) return;

      // Then start the display timer
      transitionTimer = setTimeout(() => {
        if (!mounted) return;

        // Start exit animation
        setIsExiting(true);

        // After animation, move to next question
        setTimeout(() => {
          if (mounted) {
            onAnswer(currentAnswer);
          }
        }, 500);
      }, 6000);
    });

    return () => {
      mounted = false;
      if (transitionTimer) {
        clearTimeout(transitionTimer);
      }
    };
  }, [isAnswered, currentAnswer, onAnswer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selectedOption === null) {
            handleAnswer(-1); // Force submission on timeout
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAnswer, selectedOption]);

  return (
    <div className={`${styles.question} ${isExiting ? styles.questionExit : ''}`}>
      <div className={styles.timer}>Time left: {timeLeft}s</div>
      <h2>{question.text}</h2>
      <div className={styles.options}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedOption(index);
              handleAnswer(index);
            }}
            disabled={selectedOption !== null}
            className={`${styles.option} ${
              selectedOption === index ? styles.selected : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className={styles.explanation}>
          <div className={`${styles.result} ${selectedOption === question.correctAnswer ? styles.correct : styles.incorrect}`}>
            {selectedOption === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
          </div>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default Question;
