
export interface Question {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isMastered?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  skills: string[];
  experience: string;
  qaCount: number;
  lastUpdated: string;
  questions: Question[];
  color: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  TOPIC_DETAIL = 'TOPIC_DETAIL',
  PRACTICE = 'PRACTICE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
