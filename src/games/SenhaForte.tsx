import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, XCircle, Trophy, RotateCcw, ShieldCheck } from 'lucide-react';

interface StrengthCriteria {
  id: string;
  label: string;
  test: (pwd: string) => boolean;
  tip: string;
}

const CRITERIA: StrengthCriteria[] = [
  { id: 'length', label: 'Mínimo 12 caracteres', test: (p) => p.length >= 12, tip: 'Senhas longas são exponencialmente mais difíceis de quebrar.' },
  { id: 'upper', label: 'Letras maiúsculas (A-Z)', test: (p) => /[A-Z]/.test(p), tip: 'Misturar maiúsculas e minúsculas aumenta a complexidade.' },
  { id: 'lower', label: 'Letras minúsculas (a-z)', test: (p) => /[a-z]/.test(p), tip: 'Combine diferentes tipos de caracteres.' },
  { id: 'numbers', label: 'Números (0-9)', test: (p) => /[0-9]/.test(p), tip: 'Números aumentam as combinações possíveis.' },
  { id: 'special', label: 'Símbolos (!@#$%&*)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p), tip: 'Caracteres especiais são os mais difíceis de adivinhar.' },
  { id: 'noCommon', label: 'Sem sequências óbvias', test: (p) => !/(?:123|abc|qwerty|senha|pass|admin|123456)/i.test(p), tip: 'Evite padrões previsíveis como "123456" ou "senha".' },
  { id: 'noPersonal', label: 'Sem dados pessoais', test: (p) => !/(?:nome|data|aniv|nasc|1990|1991|1992|1993|1994|1995|2000|2001|2002)/i.test(p), tip: 'Nunca use seu nome, data de nascimento ou outras infos pessoais.' },
];

function getStrength(password: string): { score: number; label: string; color: string; bgColor: string } {
  if (password.length === 0) return { score: 0, label: '', color: 'bg-slate-700', bgColor: '' };
  const passed = CRITERIA.filter(c => c.test(password)).length;
  if (passed <= 2) return { score: (passed / 7) * 100, label: 'Muito Fraca', color: 'bg-red-500', bgColor: 'text-red-400' };
  if (passed <= 3) return { score: (passed / 7) * 100, label: 'Fraca', color: 'bg-orange-500', bgColor: 'text-orange-400' };
  if (passed <= 4) return { score: (passed / 7) * 100, label: 'Razoável', color: 'bg-yellow-500', bgColor: 'text-yellow-400' };
  if (passed <= 5) return { score: (passed / 7) * 100, label: 'Boa', color: 'bg-blue-500', bgColor: 'text-blue-400' };
  if (passed <= 6) return { score: (passed / 7) * 100, label: 'Forte', color: 'bg-cyber-green', bgColor: 'text-cyber-green' };
  return { score: 100, label: 'Excelente!', color: 'bg-cyber-cyan', bgColor: 'text-cyber-cyan' };
}

interface Props {
  onComplete: (score: number) => void;
}

export default function SenhaForte({ onComplete }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const strength = getStrength(password);
  const passedCriteria = CRITERIA.filter(c => c.test(password));
  const allPassed = passedCriteria.length === CRITERIA.length;

  useEffect(() => {
    if (submitted) return;
    // Don't calculate score until submitted
  }, [password]);

  function handleSubmit() {
    const pts = Math.round((passedCriteria.length / CRITERIA.length) * 300);
    setScore(pts);
    setSubmitted(true);
  }

  function handleRestart() {
    setPassword('');
    setSubmitted(false);
    setScore(0);
  }

  const tips = [
    { icon: '🔑', title: 'Use senhas únicas', desc: 'Cada conta deve ter uma senha diferente. Reutilizar senhas é como usar uma chave para todas as fechaduras.' },
    { icon: '📱', title: 'Autenticação em 2 fatores', desc: 'Ative o 2FA em todas as contas importantes. Mesmo com a senha roubada, o invasor não consegue entrar.' },
    { icon: '🗄️', title: 'Gerenciador de senhas', desc: 'Use um gerenciador (como Bitwarden ou 1Password) para criar e guardar senhas complexas sem memorizar.' },
    { icon: '🔄', title: 'Troque periodicamente', desc: 'Mude suas senhas principais a cada 6-12 meses, especialmente após notícias de vazamentos.' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="cyber-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-lg">Crie uma Senha Forte</h3>
          {submitted && (
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-bold">{score} pts</span>
            </div>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Esta senha <strong className="text-white">não será salva ou transmitida</strong> — é apenas para praticar!
        </p>

        {/* Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => !submitted && setPassword(e.target.value)}
            placeholder="Digite sua senha aqui..."
            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 pr-12 text-white font-mono text-lg focus:outline-none focus:border-cyber-cyan transition-colors"
            disabled={submitted}
          />
          <button
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Strength Bar */}
        {password.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400">Força da senha</span>
              <span className={`text-sm font-bold ${strength.bgColor}`}>{strength.label}</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${strength.color}`}
                animate={{ width: `${strength.score}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
          {CRITERIA.map((criterion) => {
            const passed = criterion.test(password);
            return (
              <motion.div
                key={criterion.id}
                className={`flex items-center gap-2 rounded-lg p-2 text-sm transition-all ${
                  passed ? 'bg-cyber-green/10' : 'bg-slate-800/50'
                }`}
                animate={{ scale: passed ? [1, 1.05, 1] : 1 }}
              >
                {passed ? (
                  <CheckCircle size={16} className="text-cyber-green flex-shrink-0" />
                ) : (
                  <XCircle size={16} className="text-slate-500 flex-shrink-0" />
                )}
                <span className={passed ? 'text-cyber-green' : 'text-slate-400'}>{criterion.label}</span>
              </motion.div>
            );
          })}
        </div>

        {!submitted ? (
          <motion.button
            onClick={handleSubmit}
            disabled={password.length < 6}
            className={`w-full cyber-button font-bold py-3 rounded-xl transition-all ${
              password.length >= 6 ? 'cyber-button-primary' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
            whileHover={password.length >= 6 ? { scale: 1.02 } : {}}
          >
            Avaliar Senha
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 mb-4 ${
                allPassed ? 'bg-cyber-green/10 border-cyber-green/40' : 'bg-blue-500/10 border-blue-500/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={22} className={allPassed ? 'text-cyber-green' : 'text-blue-400'} />
                <span className={`font-bold ${allPassed ? 'text-cyber-green' : 'text-blue-400'}`}>
                  {allPassed ? 'Senha Excelente! 🎉' : `${passedCriteria.length}/${CRITERIA.length} critérios atendidos`}
                </span>
                <span className="ml-auto text-cyber-cyan font-bold">+{score} pts</span>
              </div>
              <p className="text-sm text-slate-300">
                {allPassed
                  ? 'Sua senha atende todos os critérios de segurança!'
                  : 'Boa tentativa! Tente atender mais critérios para uma senha mais segura.'}
              </p>
            </motion.div>
          </AnimatePresence>
        )}

        {submitted && (
          <div className="flex gap-3">
            <motion.button onClick={handleRestart} className="flex-1 cyber-button-secondary flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
              <RotateCcw size={16} />Tentar Novamente
            </motion.button>
            <motion.button onClick={() => onComplete(score)} className="flex-1 cyber-button-primary flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }}>
              <Trophy size={16} />Salvar Pontuação
            </motion.button>
          </div>
        )}
      </div>

      {/* Educational Tips */}
      <div>
        <h3 className="font-bold text-white mb-3">Dicas de Segurança</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tips.map((tip) => (
            <motion.div
              key={tip.title}
              className="glass-card p-4"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl mb-2 block">{tip.icon}</span>
              <h4 className="font-semibold text-white text-sm mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-400">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
