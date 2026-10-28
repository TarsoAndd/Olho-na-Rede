import { GameId, UserProgress, Badge } from '../types';

const STORAGE_KEY = 'cyberquest_progress';

const INITIAL_BADGES: Badge[] = [
  {
    id: 'detective',
    name: 'Detetive Digital',
    description: 'Completou o jogo Detetive do Phishing',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'hunter',
    name: 'Caçador de Golpes',
    description: 'Acertou 5 ou mais no Golpe ou Verdade?',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'password',
    name: 'Mestre das Senhas',
    description: 'Criou uma senha forte no desafio',
    icon: '🔐',
    unlocked: false,
  },
  {
    id: 'guardian',
    name: 'Guardião da Internet',
    description: 'Completou todas as missões',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'quiz-master',
    name: 'Mestre do Quiz',
    description: 'Acertou 8+ perguntas no Quiz Final',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'link-analyzer',
    name: 'Analisador de Links',
    description: 'Completou o desafio Qual Link Você Clicaria?',
    icon: '🔗',
    unlocked: false,
  },
  {
    id: 'chat-defender',
    name: 'Defensor do Chat',
    description: 'Resistiu a todos os golpes no Golpista no Chat',
    icon: '💬',
    unlocked: false,
  },
];

const INITIAL_PROGRESS: UserProgress = {
  totalScore: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  games: {
    'golpe-ou-verdade': { completed: false, score: 0, maxScore: 700, attempts: 0 },
    'detetive-phishing': { completed: false, score: 0, maxScore: 500, attempts: 0 },
    'senha-forte': { completed: false, score: 0, maxScore: 300, attempts: 0 },
    'qual-link': { completed: false, score: 0, maxScore: 600, attempts: 0 },
    'golpista-chat': { completed: false, score: 0, maxScore: 500, attempts: 0 },
  },
  badges: INITIAL_BADGES,
  quizCompleted: false,
  quizScore: 0,
  quizTotal: 10,
};

export function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with initial to handle new badges
      return {
        ...INITIAL_PROGRESS,
        ...parsed,
        games: { ...INITIAL_PROGRESS.games, ...parsed.games },
        badges: INITIAL_BADGES.map(badge => {
          const stored = parsed.badges?.find((b: Badge) => b.id === badge.id);
          return stored ? { ...badge, ...stored } : badge;
        }),
      };
    }
  } catch {
    // ignore parse errors
  }
  return { ...INITIAL_PROGRESS, badges: [...INITIAL_BADGES] };
}

export function saveProgress(progress: UserProgress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): UserProgress {
  const fresh = { ...INITIAL_PROGRESS, badges: INITIAL_BADGES.map(b => ({ ...b })) };
  saveProgress(fresh);
  return fresh;
}

export function addScore(progress: UserProgress, gameId: GameId, points: number): UserProgress {
  const currentGame = progress.games[gameId];
  const newScore = Math.max(currentGame.score, points);
  const scoreDiff = newScore - currentGame.score;

  const newXp = progress.xp + Math.floor(points / 10);
  let newLevel = progress.level;
  let xpForNext = progress.xpToNextLevel;

  let remainingXp = newXp;
  while (remainingXp >= xpForNext) {
    remainingXp -= xpForNext;
    newLevel += 1;
    xpForNext = Math.floor(xpForNext * 1.5);
  }

  const updated: UserProgress = {
    ...progress,
    totalScore: progress.totalScore + (points > currentGame.score ? scoreDiff : 0),
    level: newLevel,
    xp: remainingXp,
    xpToNextLevel: xpForNext,
    games: {
      ...progress.games,
      [gameId]: {
        ...currentGame,
        score: newScore,
        attempts: currentGame.attempts + 1,
      },
    },
  };

  saveProgress(updated);
  return updated;
}

export function completeGame(progress: UserProgress, gameId: GameId, score: number): UserProgress {
  const updated = addScore(progress, gameId, score);
  const withCompleted: UserProgress = {
    ...updated,
    games: {
      ...updated.games,
      [gameId]: {
        ...updated.games[gameId],
        completed: true,
        score,
      },
    },
  };
  saveProgress(withCompleted);
  return withCompleted;
}

export function unlockBadge(progress: UserProgress, badgeId: string): UserProgress {
  const updated: UserProgress = {
    ...progress,
    badges: progress.badges.map(badge =>
      badge.id === badgeId && !badge.unlocked
        ? { ...badge, unlocked: true, unlockedAt: new Date() }
        : badge
    ),
  };
  saveProgress(updated);
  return updated;
}

export function getCompletedCount(progress: UserProgress): number {
  return Object.values(progress.games).filter(g => g.completed).length;
}
