export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizConfig {
  topic: string;
  difficulty: string;
  questionCount: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number;
  timeTaken: number; // in seconds
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface QuizResult {
  score: number;
  total: number;
  accuracy: number;
  answers: UserAnswer[];
  questions: Question[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
}
