import { motion } from 'framer-motion';
import { Users, CheckCircle, TrendingUp } from 'lucide-react';

interface GameStatsBarProps {
  attempts: number;
  completions: number;
  loading?: boolean;
  className?: string;
}

// Formata número grande de forma legível: 1234 → 1.234
function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR');
}

// Calcula taxa de conclusão
function completionRate(attempts: number, completions: number): number {
  if (attempts === 0) return 0;
  return Math.round((completions / attempts) * 100);
}

export default function GameStatsBar({
  attempts,
  completions,
  loading = false,
  className = '',
}: GameStatsBarProps) {
  const rate = completionRate(attempts, completions);

  if (loading) {
    return (
      <div className={`flex gap-3 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-5 w-16 bg-slate-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 text-xs ${className}`}>
      {/* Total de tentativas */}
      <motion.div
        className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        title="Total de pessoas que tentaram este jogo"
      >
        <Users size={12} className="text-cyber-cyan flex-shrink-0" />
        <span className="text-slate-300 font-medium">
          {formatNumber(attempts)}
        </span>
        <span className="text-slate-500">tentativas</span>
      </motion.div>

      {/* Conclusões */}
      <motion.div
        className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        title="Quantas pessoas concluíram este jogo"
      >
        <CheckCircle size={12} className="text-cyber-green flex-shrink-0" />
        <span className="text-slate-300 font-medium">
          {formatNumber(completions)}
        </span>
        <span className="text-slate-500">concluíram</span>
      </motion.div>

      {/* Taxa de conclusão */}
      {attempts > 0 && (
        <motion.div
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border ${
            rate >= 70
              ? 'bg-cyber-green/10 border-cyber-green/30'
              : rate >= 40
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          title="Taxa de conclusão"
        >
          <TrendingUp
            size={12}
            className={rate >= 70 ? 'text-cyber-green' : rate >= 40 ? 'text-yellow-400' : 'text-red-400'}
          />
          <span className={`font-bold ${rate >= 70 ? 'text-cyber-green' : rate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {rate}%
          </span>
          <span className="text-slate-500">concluem</span>
        </motion.div>
      )}
    </div>
  );
}
