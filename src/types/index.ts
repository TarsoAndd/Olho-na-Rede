export type GameId = 'golpe-ou-verdade' | 'detetive-phishing' | 'senha-forte' | 'qual-link' | 'golpista-chat';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameProgress {
  completed: boolean;
  score: number;
  maxScore: number;
  attempts: number;
}

export interface UserProgress {
  totalScore: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  games: Record<GameId, GameProgress>;
  badges: Badge[];
  quizCompleted: boolean;
  quizScore: number;
  quizTotal: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}
