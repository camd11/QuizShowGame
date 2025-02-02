import React, { useState, useEffect } from 'react';
import { Question as QuestionType, PlayerAnswer } from '../../types/game';
import styles from './Question.module.css';

interface QuestionProps {
  question: QuestionType;
  onAnswer: (answer: PlayerAnswer) => void;
  timeLimit?: number; // in seconds
}

const Question: React.FC<QuestionProps> = ({ 
  question, 
  onAnswer, 
  timeLimit = 30 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime] = useState(Date.now());

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
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const timeToAnswer = (Date.now() - startTime) / 1000;
    const answer: PlayerAnswer = {
      questionId: question.id,
      selectedOption: optionIndex,
      isCorrect: optionIndex === question.correctAnswer,
      timeToAnswer
    };
    onAnswer(answer);
  };

  return (
    <div className={styles.question}>
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
    </div>
  );
};

export default Question;
