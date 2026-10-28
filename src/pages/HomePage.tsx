import { motion } from 'framer-motion';
import {
  Shield, Zap, Lock, AlertTriangle, Eye, MessageCircle,
  ChevronRight, Star, Trophy, Gamepad2
} from 'lucide-react';
import { UserProgress } from '../types';
import { getCompletedCount } from '../store/progressStore';

interface HomePageProps {
  progress: UserProgress;
  onNavigate: (page: string) => void;
}

const DANGERS = [
  { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', title: 'Phishing', desc: 'E-mails e mensagens falsas que roubam seus dados' },
  { icon: MessageCircle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20', title: 'Golpes no Chat', desc: 'Fraudes via WhatsApp e redes sociais' },
  { icon: Eye, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', title: 'Engenharia Social', desc: 'Manipulação psicológica para obter informações' },
  { icon: Lock, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10 border-cyber-cyan/20', title: 'Senhas Fracas', desc: 'Contas vulneráveis a invasões' },
  { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', title: 'Links Maliciosos', desc: 'URLs falsas que imitam sites legítimos' },
  { icon: Shield, color: 'text-cyber-green', bg: 'bg-cyber-green/10 border-cyber-green/20', title: 'Vazamento de Dados', desc: 'Exposição de informações pessoais na internet' },
];

const GAMES = [
  { id: 'golpe-ou-verdade', icon: '🎯', title: 'Golpe ou Verdade?', desc: 'Identifique mensagens fraudulentas', difficulty: 'Fácil', color: 'from-blue-500 to-blue-700' },
  { id: 'detetive-phishing', icon: '🔍', title: 'Detetive do Phishing', desc: 'Encontre elementos suspeitos em e-mails', difficulty: 'Médio', color: 'from-purple-500 to-purple-700' },
  { id: 'senha-forte', icon: '🔐', title: 'Senha Forte', desc: 'Aprenda a criar senhas seguras', difficulty: 'Fácil', color: 'from-green-500 to-emerald-700' },
  { id: 'qual-link', icon: '🔗', title: 'Qual Link Clicar?', desc: 'Identifique links maliciosos', difficulty: 'Médio', color: 'from-orange-500 to-red-600' },
  { id: 'golpista-chat', icon: '💬', title: 'Golpista no Chat', desc: 'Resista aos golpes de engenharia social', difficulty: 'Difícil', color: 'from-pink-500 to-rose-700' },
];

export default function HomePage({ progress, onNavigate }: HomePageProps) {
  const completedCount = getCompletedCount(progress);
  const progressPct = (completedCount / 5) * 100;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-10"
              style={{
                width: `${150 + i * 80}px`,
                height: `${150 + i * 80}px`,
                left: `${10 + i * 15}%`,
                top: `${10 + i * 10}%`,
                background: i % 2 === 0 ? '#06b6d4' : '#6d28d9',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-full px-4 py-2 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield size={16} className="text-cyber-cyan" />
              <span className="text-slate-500 font-medium">Plataforma de Educação em Segurança Digital</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Você está </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-cyan">
                preparado
              </span>
              <br />
              <span className="text-white">para os perigos da internet?</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Aprenda a identificar golpes, proteger seus dados e navegar com segurança
              através de desafios interativos e divertidos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => onNavigate('missions')}
                className="cyber-button-primary flex items-center gap-2 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Gamepad2 size={22} />
                Começar Aventura
                <ChevronRight size={20} />
              </motion.button>

              <motion.button
                onClick={() => onNavigate('learn')}
                className="cyber-button-secondary flex items-center gap-2 text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield size={22} />
                Aprender Primeiro
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: 'Minigames', value: '5', icon: '🎮' },
              { label: 'Tópicos', value: '8', icon: '📚' },
              { label: 'Quiz Final', value: '10', icon: '🏆' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-cyber-cyan">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Progress Section */}
      {completedCount > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="cyber-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                    <Trophy size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Seu Progresso</h3>
                    <p className="text-sm text-slate-400">Nível {progress.level} · {progress.totalScore} pontos</p>
                  </div>
                </div>
                <span className="text-cyber-cyan font-bold text-xl">{completedCount}/5</span>
              </div>
              <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Missões completas</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Dangers Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-3">
              Principais Perigos Digitais
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Conheça as ameaças mais comuns que você pode encontrar ao navegar na internet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DANGERS.map((danger, i) => {
              const Icon = danger.icon;
              return (
                <motion.div
                  key={danger.title}
                  className={`rounded-xl p-5 border ${danger.bg} hover:scale-105 transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`${danger.color} mb-3`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="font-bold text-white mb-1">{danger.title}</h3>
                  <p className="text-sm text-slate-400">{danger.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Games Preview Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-3">
              Missões Disponíveis
            </h2>
            <p className="text-slate-400">
              5 desafios interativos para treinar sua defesa contra golpes digitais
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES.map((game, i) => {
              const gameProgress = progress.games[game.id as keyof typeof progress.games];
              const isCompleted = gameProgress?.completed;
              return (
                <motion.div
                  key={game.id}
                  className="cyber-card cursor-pointer group relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => onNavigate('missions')}
                >
                  {isCompleted && (
                    <div className="absolute top-3 right-3 bg-cyber-green/20 border border-cyber-green/40 rounded-full px-2 py-0.5">
                      <span className="text-cyber-green text-xs font-bold">✓ Completo</span>
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl mb-4`}>
                    {game.icon}
                  </div>
                  <h3 className="font-bold text-white mb-1">{game.title}</h3>
                  <p className="text-sm text-slate-400 mb-3">{game.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      game.difficulty === 'Fácil' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                      game.difficulty === 'Médio' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                      'text-red-400 bg-red-400/10 border-red-400/20'
                    }`}>
                      {game.difficulty}
                    </span>
                    {isCompleted && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-sm font-bold">{gameProgress.score}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <motion.button
              onClick={() => onNavigate('missions')}
              className="cyber-button-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Todas as Missões
            </motion.button>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-3">Conquistas</h2>
            <p className="text-slate-400">Desbloqueie medalhas ao completar desafios</p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {progress.badges.map((badge, i) => (
              <motion.div
                key={badge.id}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  badge.unlocked
                    ? 'bg-yellow-400/10 border-yellow-400/30'
                    : 'bg-slate-800/50 border-slate-700/50 opacity-50'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: badge.unlocked ? 1 : 0.5, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                title={badge.description}
              >
                <span className="text-2xl">{badge.unlocked ? badge.icon : '🔒'}</span>
                <span className="text-xs text-center text-slate-300 leading-tight">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
