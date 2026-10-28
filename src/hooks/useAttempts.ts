import { useState, useEffect, useCallback } from 'react';
import { GameId } from '../types';

interface GameStats {
  attempts: number;
  completions: number;
}

type AllStats = Record<GameId, GameStats>;

const DEFAULT_STATS: GameStats = { attempts: 0, completions: 0 };

// Em desenvolvimento local, usa dados mock para não depender da API
const IS_DEV = import.meta.env.DEV;

// Hook para buscar os contadores globais de todos os jogos
export function useAllAttempts() {
  const [stats, setStats] = useState<AllStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      if (IS_DEV) {
        // Em dev, simula dados para visualizar o layout
        setStats({
          'golpe-ou-verdade':   { attempts: 142, completions: 98  },
          'detetive-phishing':  { attempts: 87,  completions: 54  },
          'senha-forte':        { attempts: 203, completions: 189 },
          'qual-link':          { attempts: 76,  completions: 41  },
          'golpista-chat':      { attempts: 61,  completions: 29  },
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/attempts');
        if (!res.ok) throw new Error('Erro ao buscar estatísticas');
        const data = await res.json();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

// Hook para um jogo específico — busca e registra tentativa/conclusão
export function useGameAttempts(gameId: GameId) {
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGameStats() {
      if (IS_DEV) {
        const mock: Record<GameId, GameStats> = {
          'golpe-ou-verdade':  { attempts: 142, completions: 98  },
          'detetive-phishing': { attempts: 87,  completions: 54  },
          'senha-forte':       { attempts: 203, completions: 189 },
          'qual-link':         { attempts: 76,  completions: 41  },
          'golpista-chat':     { attempts: 61,  completions: 29  },
        };
        setStats(mock[gameId]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/attempts?game=${gameId}`);
        if (!res.ok) throw new Error('Erro ao buscar stats');
        const data = await res.json();
        setStats({ attempts: data.attempts, completions: data.completions });
      } catch {
        // Silencia o erro — o jogo funciona mesmo sem as stats
      } finally {
        setLoading(false);
      }
    }

    fetchGameStats();
  }, [gameId]);

  // Registra uma tentativa quando o usuário inicia o jogo
  const registerAttempt = useCallback(async () => {
    if (IS_DEV) {
      setStats(s => ({ ...s, attempts: s.attempts + 1 }));
      return;
    }
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: gameId, type: 'attempt' }),
      });
      if (res.ok) {
        const data = await res.json();
        setStats(s => ({ ...s, attempts: data.count }));
      }
    } catch {
      // Silencia — não interrompe o jogo
    }
  }, [gameId]);

  // Registra uma conclusão quando o usuário termina o jogo
  const registerCompletion = useCallback(async () => {
    if (IS_DEV) {
      setStats(s => ({ ...s, completions: s.completions + 1 }));
      return;
    }
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: gameId, type: 'completion' }),
      });
      if (res.ok) {
        const data = await res.json();
        setStats(s => ({ ...s, completions: data.count }));
      }
    } catch {
      // Silencia — não interrompe o jogo
    }
  }, [gameId]);

  return { stats, loading, registerAttempt, registerCompletion };
}
