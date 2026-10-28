import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Users } from 'lucide-react';
import { UserProgress, GameId } from '../types';
import { completeGame, unlockBadge } from '../store/progressStore';
import { useAllAttempts, useGameAttempts } from '../hooks/useAttempts';
import GameStatsBar from '../components/GameStatsBar';
import GolpeOuVerdade from '../games/GolpeOuVerdade';
import DetetivePhishing from '../games/DetetivePhishing';
import SenhaForte from '../games/SenhaForte';
import QualLink from '../games/QualLink';
import GolpistaChat from '../games/GolpistaChat';

interface Mission {
  id: GameId;
  icon: string;
  title: string;
  desc: string;
  longDesc: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  color: string;
  gradient: string;
  maxScore: number;
  badgeId?: string;
}

const MISSIONS: Mission[] = [
  {
    id: 'golpe-ou-verdade',
    icon: '🎯',
    title: 'Golpe ou Verdade?',
    desc: 'Identifique mensagens fraudulentas',
    longDesc: 'Analise 7 mensagens reais de SMS, e-mail e WhatsApp e decida: é um golpe ou uma comunicação legítima?',
    difficulty: 'Fácil',
    color: 'from-blue-500 to-blue-700',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-blue-700/10 border-blue-500/30',
    maxScore: 700,
    badgeId: 'hunter',
  },
  {
    id: 'detetive-phishing',
    icon: '🔍',
    title: 'Detetive do Phishing',
    desc: 'Encontre elementos suspeitos em e-mails',
    longDesc: 'Examine e-mails simulados e clique nos elementos suspeitos. Quanto mais encontrar, mais pontos!',
    difficulty: 'Médio',
    color: 'from-purple-500 to-purple-700',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-purple-700/10 border-purple-500/30',
    maxScore: 500,
    badgeId: 'detective',
  },
  {
    id: 'senha-forte',
    icon: '🔐',
    title: 'Senha Forte',
    desc: 'Aprenda a criar senhas seguras',
    longDesc: 'Crie uma senha que atenda todos os critérios de segurança e aprenda as melhores práticas.',
    difficulty: 'Fácil',
    color: 'from-green-500 to-emerald-700',
    gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-700/10 border-green-500/30',
    maxScore: 300,
    badgeId: 'password',
  },
  {
    id: 'qual-link',
    icon: '🔗',
    title: 'Qual Link Clicar?',
    desc: 'Identifique links maliciosos',
    longDesc: 'Analise diferentes URLs e identifique quais são seguras e quais são tentativas de phishing.',
    difficulty: 'Médio',
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-600/10 border-orange-500/30',
    maxScore: 600,
    badgeId: 'link-analyzer',
  },
  {
    id: 'golpista-chat',
    icon: '💬',
    title: 'Golpista no Chat',
    desc: 'Resista aos golpes de engenharia social',
    longDesc: 'Converse com um golpista simulado e tome as decisões certas para não cair nas armadilhas.',
    difficulty: 'Difícil',
    color: 'from-pink-500 to-rose-700',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-700/10 border-pink-500/30',
    maxScore: 500,
    badgeId: 'chat-defender',
  },
];

// ─── Wrapper do jogo ativo: registra tentativa ao montar ─────────────────────
interface ActiveGameProps {
  gameId: GameId;
  onComplete: (score: number) => void;
  progress: UserProgress;
}

function ActiveGame({ gameId, onComplete, progress }: ActiveGameProps) {
  const { registerAttempt, registerCompletion, stats } = useGameAttempts(gameId);

  // Registra tentativa assim que o jogo é aberto
  useEffect(() => {
    registerAttempt();
  }, []);

  // Intercepta a conclusão para também registrar no Redis
  async function handleComplete(score: number) {
    await registerCompletion();
    onComplete(score);
  }

  return (
    <>
      {/* Contador global dentro do jogo */}
      {stats.attempts > 0 && (
        <motion.div
          className="mb-4 flex items-center gap-2 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Users size={12} />
          <span>
            <span className="text-slate-300 font-medium">
              {stats.attempts.toLocaleString('pt-BR')}
            </span>{' '}
            pessoas já tentaram este desafio
          </span>
        </motion.div>
      )}

      {gameId === 'golpe-ou-verdade' && (
        <GolpeOuVerdade
          onComplete={handleComplete}
          currentScore={progress.games['golpe-ou-verdade'].score}
        />
      )}
      {gameId === 'detetive-phishing' && (
        <DetetivePhishing onComplete={handleComplete} />
      )}
      {gameId === 'senha-forte' && (
        <SenhaForte onComplete={handleComplete} />
      )}
      {gameId === 'qual-link' && (
        <QualLink onComplete={handleComplete} />
      )}
      {gameId === 'golpista-chat' && (
        <GolpistaChat onComplete={handleComplete} />
      )}
    </>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
interface Props {
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

export default function MissionsPage({ progress, onProgressUpdate }: Props) {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const { stats, loading: statsLoading } = useAllAttempts();

  function handleGameComplete(gameId: GameId, score: number, badgeId?: string) {
    let updated = completeGame(progress, gameId, score);

    const allCompleted = Object.values(updated.games).every(g => g.completed);
    if (allCompleted) updated = unlockBadge(updated, 'guardian');
    if (badgeId && score > 0) updated = unlockBadge(updated, badgeId);

    onProgressUpdate(updated);
    setActiveGame(null);
  }

  // ─── Jogo ativo ────────────────────────────────────────────────────────────
  if (activeGame) {
    const mission = MISSIONS.find(m => m.id === activeGame)!;
    return (
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            whileHover={{ x: -4 }}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </motion.button>
          <div className="h-4 w-px bg-slate-600" />
          <span className="text-xl">{mission.icon}</span>
          <h1 className="font-bold text-white">{mission.title}</h1>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ActiveGame
              gameId={activeGame}
              onComplete={(score) =>
                handleGameComplete(
                  activeGame,
                  score,
                  score > 0 ? mission.badgeId : undefined,
                )
              }
              progress={progress}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ─── Lista de missões ───────────────────────────────────────────────────────
  const completedCount = MISSIONS.filter(m => progress.games[m.id].completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-3">
          Missões de Segurança
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Complete todas as missões para se tornar um especialista em segurança digital
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-cyber-cyan font-bold text-xl">{completedCount}</span>
            <span className="text-slate-400 text-sm">/ {MISSIONS.length} completas</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold">{progress.totalScore}</span>
            <span className="text-slate-400 text-sm">pts totais</span>
          </div>
          {/* Total global de tentativas em todos os jogos */}
          {stats && (
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Users size={14} className="text-cyber-cyan" />
              <span className="text-cyber-cyan font-bold">
                {Object.values(stats)
                  .reduce((sum, s) => sum + s.attempts, 0)
                  .toLocaleString('pt-BR')}
              </span>
              <span className="text-slate-400 text-sm">tentativas globais</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Cards de missão */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MISSIONS.map((mission, i) => {
          const gameProgress = progress.games[mission.id];
          const isCompleted = gameProgress.completed;
          const missionStats = stats?.[mission.id];

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${mission.gradient}`}
              onClick={() => setActiveGame(mission.id)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {mission.icon}
                </div>
                {isCompleted && (
                  <div className="bg-cyber-green/20 border border-cyber-green/40 rounded-full px-2 py-1">
                    <span className="text-cyber-green text-xs font-bold">✓ Completo</span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-white text-lg mb-1">{mission.title}</h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{mission.longDesc}</p>

              {/* Dificuldade + pontuação */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                  mission.difficulty === 'Fácil'
                    ? 'text-green-400 bg-green-400/10 border-green-400/20'
                    : mission.difficulty === 'Médio'
                    ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                    : 'text-red-400 bg-red-400/10 border-red-400/20'
                }`}>
                  {mission.difficulty}
                </span>

                {isCompleted ? (
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{gameProgress.score}</span>
                    <span className="text-slate-500 text-xs">/ {mission.maxScore}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">até {mission.maxScore} pts</span>
                )}
              </div>

              {/* ── Contador global de tentativas ── */}
              <div className="border-t border-white/5 pt-3 mt-1">
                <GameStatsBar
                  attempts={missionStats?.attempts ?? 0}
                  completions={missionStats?.completions ?? 0}
                  loading={statsLoading}
                />
              </div>

              {/* Barra de progresso pessoal */}
              {isCompleted && (
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${mission.color} rounded-full`}
                      style={{ width: `${(gameProgress.score / mission.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Conquista de todas completas */}
      {completedCount === MISSIONS.length && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="glass-card inline-block px-8 py-6">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="text-xl font-black text-white mb-2">Todas as Missões Completas!</h3>
            <p className="text-slate-400 text-sm">
              Você desbloqueou a conquista{' '}
              <span className="text-yellow-400 font-bold">Guardião da Internet</span>!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
