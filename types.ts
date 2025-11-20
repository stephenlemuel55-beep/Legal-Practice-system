export enum View {
  DASHBOARD = 'DASHBOARD',
  RESEARCH = 'RESEARCH',
  ANALYSIS = 'ANALYSIS',
  PREDICTION = 'PREDICTION',
  DRAFTING = 'DRAFTING',
  CHAT = 'CHAT',
  STORAGE = 'STORAGE',
  COURTS = 'COURTS',
  NEWS = 'NEWS',
  BLOG = 'BLOG'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface CourtInfo {
  name: string;
  jurisdiction: string;
  type: 'Federal' | 'State' | 'Specialized';
  location: string;
}

export interface LegalDoc {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'Draft' | 'Final' | 'Review';
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  imageUrl: string;
}
