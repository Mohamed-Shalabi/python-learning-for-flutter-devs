export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'basics' | 'advanced' | 'tooling' | 'async' | 'data-science';
  status: 'locked' | 'unlocked' | 'completed';
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewState {
  ROADMAP = 'ROADMAP',
  LESSON = 'LESSON',
  CHAT = 'CHAT',
}

export interface GeneratedContent {
  markdown: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  };
}