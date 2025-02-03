import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Question from './Question';
import { Question as QuestionType } from '../../types/game';

// Mock timer using jest
jest.useFakeTimers();

describe('Question Component', () => {
  const mockQuestion: QuestionType = {
    id: '1',
    text: 'Test question?',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    correctAnswer: 0,
    explanation: 'Test explanation'
  };

  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('renders question text and options', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    expect(screen.getByText('Test question?')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('Option 4')).toBeInTheDocument();
  });

  it('handles answer selection and shows explanation', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    // Explanation should not be visible initially
    expect(screen.queryByText('Test explanation')).not.toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect!')).not.toBeInTheDocument();

    // Select correct answer
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: '1',
      selectedOption: 0,
      isCorrect: true,
      timeToAnswer: expect.any(Number)
    });

    // Explanation should be visible with correct message
    expect(screen.getByText('Test explanation')).toBeInTheDocument();
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });

  it('shows incorrect message for wrong answer', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    // Select wrong answer
    fireEvent.click(screen.getByText('Option 2'));

    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: '1',
      selectedOption: 1,
      isCorrect: false,
      timeToAnswer: expect.any(Number)
    });

    // Should show incorrect message
    expect(screen.getByText('Test explanation')).toBeInTheDocument();
    expect(screen.getByText('Incorrect!')).toBeInTheDocument();
  });

  it('disables options after selection', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    fireEvent.click(screen.getByText('Option 1'));
    
    const options = screen.getAllByRole('button');
    options.forEach(option => {
      expect(option).toBeDisabled();
    });
  });

  it('updates timer every second', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    expect(screen.getByText('Time left: 30s')).toBeInTheDocument();

    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Time left: 29s')).toBeInTheDocument();
  });

  it('submits answer on timeout', () => {
    render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    // Advance timer to completion
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(mockOnAnswer).toHaveBeenCalledWith({
      questionId: '1',
      selectedOption: -1,
      isCorrect: false,
      timeToAnswer: expect.any(Number)
    });
  });

  it('resets state and hides explanation when question changes', () => {
    const { rerender } = render(
      <Question
        question={mockQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    // Select an answer
    fireEvent.click(screen.getByText('Option 1'));
    
    // Verify options are disabled
    const options = screen.getAllByRole('button');
    options.forEach(option => {
      expect(option).toBeDisabled();
    });

    // New question
    const newQuestion: QuestionType = {
      id: '2',
      text: 'New question?',
      options: ['New 1', 'New 2', 'New 3', 'New 4'],
      correctAnswer: 1,
      explanation: 'New explanation'
    };

    // Rerender with new question
    rerender(
      <Question
        question={newQuestion}
        onAnswer={mockOnAnswer}
        timeLimit={30}
      />
    );

    // Verify new question is rendered
    expect(screen.getByText('New question?')).toBeInTheDocument();

    // Verify options are enabled
    const newOptions = screen.getAllByRole('button');
    newOptions.forEach(option => {
      expect(option).not.toBeDisabled();
    });

    // Verify timer is reset and explanation is hidden
    expect(screen.getByText('Time left: 30s')).toBeInTheDocument();
    expect(screen.queryByText('Test explanation')).not.toBeInTheDocument();
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument();
    expect(screen.queryByText('Incorrect!')).not.toBeInTheDocument();
  });
});
