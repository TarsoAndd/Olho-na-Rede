import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// O Redis é inicializado automaticamente pelas variáveis de ambiente
// UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN
// que serão configuradas no painel do Vercel
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const VALID_GAMES = [
  'golpe-ou-verdade',
  'detetive-phishing',
  'senha-forte',
  'qual-link',
  'golpista-chat',
];

// GET /api/attempts        → retorna contadores de todos os jogos
// GET /api/attempts?game=X → retorna contador de um jogo específico
// POST /api/attempts       → body: { game, type: 'attempt' | 'completion' }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permite requisições do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { game } = req.query;

      if (game && typeof game === 'string') {
        // Retorna dados de um jogo específico
        if (!VALID_GAMES.includes(game)) {
          return res.status(400).json({ error: 'Jogo inválido' });
        }
        const [attempts, completions] = await Promise.all([
          redis.get<number>(`attempts:${game}`) ?? 0,
          redis.get<number>(`completions:${game}`) ?? 0,
        ]);
        return res.status(200).json({ game, attempts: attempts || 0, completions: completions || 0 });
      }

      // Retorna dados de todos os jogos em paralelo
      const keys = VALID_GAMES.flatMap(g => [
        `attempts:${g}`,
        `completions:${g}`,
      ]);

      const values = await redis.mget<number[]>(...keys);

      const result: Record<string, { attempts: number; completions: number }> = {};
      VALID_GAMES.forEach((game, i) => {
        result[game] = {
          attempts: values[i * 2] || 0,
          completions: values[i * 2 + 1] || 0,
        };
      });

      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const { game, type } = req.body as { game: string; type: 'attempt' | 'completion' };

      if (!game || !VALID_GAMES.includes(game)) {
        return res.status(400).json({ error: 'Jogo inválido' });
      }

      if (type !== 'attempt' && type !== 'completion') {
        return res.status(400).json({ error: 'Tipo inválido. Use "attempt" ou "completion"' });
      }

      const key = type === 'attempt' ? `attempts:${game}` : `completions:${game}`;
      const newValue = await redis.incr(key);

      return res.status(200).json({ game, type, count: newValue });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro na API de tentativas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
