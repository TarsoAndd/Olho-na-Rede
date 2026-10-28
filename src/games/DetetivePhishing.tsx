import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCcw, Trophy, Info } from 'lucide-react';

interface SuspectElement {
  id: string;
  label: string;
  value: string;
  isSuspect: boolean;
  explanation: string;
}

interface PhishingEmail {
  id: number;
  subject: string;
  elements: SuspectElement[];
  body: string;
  bodyFlags: { text: string; isSuspect: boolean; explanation: string }[];
}

const EMAILS: PhishingEmail[] = [
  {
    id: 1,
    subject: 'URGENTE: Atualize seus dados bancários agora!',
    elements: [
      { id: 'from', label: 'De:', value: 'seguranca@bradesc0-banco.com', isSuspect: true, explanation: 'Domínio falso! O zero (0) substituiu a letra "o" em "bradesco". O real seria bradesco.com.br.' },
      { id: 'to', label: 'Para:', value: 'voce@seumail.com', isSuspect: false, explanation: '' },
      { id: 'subject', label: 'Assunto:', value: 'URGENTE: Atualize seus dados bancários agora!', isSuspect: true, explanation: 'Assuntos com "URGENTE" são táticas de pressão comuns em phishing.' },
    ],
    body: '',
    bodyFlags: [
      { text: 'Prezado(a) Cliente,', isSuspect: false, explanation: '' },
      { text: 'Detectamos atividades suspeitas em sua conta. Para evitar o bloqueio IMEDIATO,', isSuspect: true, explanation: 'Ameaça de bloqueio imediato cria pânico e pressiona a vítima a agir sem pensar.' },
      { text: 'atualize seus dados clicando no link abaixo:', isSuspect: false, explanation: '' },
      { text: 'http://bradesco-atualizacao-dados.tk/login', isSuspect: true, explanation: 'Link falso! Domínio .tk suspeito, não é bradesco.com.br. Nunca clique em links de e-mails urgentes.' },
      { text: 'Caso não atualize em 24 horas, sua conta será suspensa permanentemente.', isSuspect: true, explanation: 'Prazo de 24h é tática de pressão. Bancos reais não fazem isso por e-mail.' },
      { text: 'Atenciosamente, Equipe de Segurança Bradesco', isSuspect: false, explanation: '' },
    ],
  },
  {
    id: 2,
    subject: 'Sua fatura do mês está disponivel',
    elements: [
      { id: 'from', label: 'De:', value: 'faturas@nubank.com.br', isSuspect: false, explanation: '' },
      { id: 'to', label: 'Para:', value: 'voce@seumail.com', isSuspect: false, explanation: '' },
      { id: 'subject', label: 'Assunto:', value: 'Sua fatura do mês está disponivel', isSuspect: true, explanation: 'Erro de ortografia: "disponivel" sem acento. Empresas profissionais revisam seus e-mails.' },
    ],
    body: '',
    bodyFlags: [
      { text: 'Ola cliente,', isSuspect: true, explanation: 'Ausência de saudação personalizada e erro ortográfico ("Ola" sem acento). O Nubank sempre usa seu primeiro nome.' },
      { text: 'Sua fatura de Outubro ficou R$1.547,90. Acesse o app para ver os detalhes.', isSuspect: false, explanation: '' },
      { text: 'OU clique aqui para pagar: bit.ly/pagar-nubank-fatura', isSuspect: true, explanation: 'Link encurtado (bit.ly) para pagamento é altamente suspeito. Use sempre o app oficial.' },
      { text: 'O Nubank nunca pedirá sua senha.', isSuspect: false, explanation: '' },
      { text: 'Em caso de dúvidas, fale conosco pelo chat do app.', isSuspect: false, explanation: '' },
    ],
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export default function DetetivePhishing({ onComplete }: Props) {
  const [emailIndex, setEmailIndex] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [allDone, setAllDone] = useState(false);

  const email = EMAILS[emailIndex];
  const allSuspects = [
    ...email.elements.filter(e => e.isSuspect).map(e => e.id),
    ...email.bodyFlags.map((_, i) => `body-${i}`).filter((_, i) => email.bodyFlags[i].isSuspect),
  ];
  const missedCount = allSuspects.filter(id => !found.has(id)).length;

  function handleElementClick(el: SuspectElement) {
    if (revealed.has(el.id)) return;
    setRevealed(r => new Set([...r, el.id]));
    if (el.isSuspect) {
      setFound(f => new Set([...f, el.id]));
      setScore(s => s + 50);
    }
  }

  function handleBodyClick(idx: number) {
    const id = `body-${idx}`;
    if (revealed.has(id)) return;
    setRevealed(r => new Set([...r, id]));
    const flag = email.bodyFlags[idx];
    if (flag.isSuspect) {
      setFound(f => new Set([...f, id]));
      setScore(s => s + 50);
    }
  }

  function handleFinishEmail() {
    setFinished(true);
  }

  function handleNextEmail() {
    if (emailIndex >= EMAILS.length - 1) {
      setAllDone(true);
    } else {
      setEmailIndex(i => i + 1);
      setFound(new Set());
      setRevealed(new Set());
      setFinished(false);
    }
  }

  if (allDone) {
    return (
      <motion.div className="max-w-xl mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="cyber-card">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-black text-white mb-2">Investigação Concluída!</h2>
          <div className="text-4xl font-black text-cyber-cyan mb-4">{score} pts</div>
          <p className="text-slate-400 mb-6">Você analisou {EMAILS.length} e-mails suspeitos e identificou os elementos de phishing.</p>
          <div className="flex gap-3 justify-center">
            <motion.button onClick={() => { setEmailIndex(0); setFound(new Set()); setRevealed(new Set()); setFinished(false); setAllDone(false); setScore(0); }} className="cyber-button-secondary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <RotateCcw size={16} />Jogar Novamente
            </motion.button>
            <motion.button onClick={() => onComplete(score)} className="cyber-button-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
              <Trophy size={16} />Salvar Pontuação
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm">E-mail {emailIndex + 1} de {EMAILS.length}</p>
          <p className="text-xs text-cyber-cyan mt-0.5">Clique nos elementos suspeitos</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">{score} pts</span>
        </div>
      </div>

      {/* Email Simulation */}
      <div className="rounded-xl border border-blue-800/40 bg-blue-950/20 overflow-hidden mb-4">
        {/* Email Header */}
        <div className="border-b border-blue-800/30 p-4 space-y-2">
          {email.elements.map((el) => {
            const isRevealed = revealed.has(el.id);
            return (
              <motion.div
                key={el.id}
                onClick={() => handleElementClick(el)}
                className={`flex gap-2 text-sm rounded-lg p-2 cursor-pointer transition-all ${
                  isRevealed
                    ? el.isSuspect
                      ? 'bg-red-500/20 border border-red-500/50'
                      : 'bg-cyber-green/10 border border-cyber-green/30'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <span className="text-slate-500 font-medium w-16 flex-shrink-0">{el.label}</span>
                <span className={`font-mono ${isRevealed && el.isSuspect ? 'text-red-400' : isRevealed ? 'text-cyber-green' : 'text-slate-300'}`}>
                  {el.value}
                </span>
                {isRevealed && el.isSuspect && <span className="text-red-400 ml-auto">⚠️</span>}
                {isRevealed && !el.isSuspect && <span className="text-cyber-green ml-auto">✓</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Email Body */}
        <div className="p-4 space-y-2">
          {email.bodyFlags.map((flag, idx) => {
            const id = `body-${idx}`;
            const isRevealed = revealed.has(id);
            return (
              <motion.p
                key={idx}
                onClick={() => handleBodyClick(idx)}
                className={`text-sm rounded-lg px-3 py-2 cursor-pointer transition-all leading-relaxed ${
                  isRevealed
                    ? flag.isSuspect
                      ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                      : 'bg-cyber-green/10 border border-cyber-green/30 text-green-300'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
                whileHover={{ scale: 1.005 }}
              >
                {flag.text}
                {isRevealed && flag.isSuspect && ' ⚠️'}
              </motion.p>
            );
          })}
        </div>
      </div>

      {/* Explanations */}
      <AnimatePresence>
        {revealed.size > 0 && (
          <motion.div
            className="space-y-2 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {[...email.elements, ...email.bodyFlags.map((f, i) => ({ ...f, id: `body-${i}` }))].map((el: any) => {
              if (!revealed.has(el.id) || !el.isSuspect || !el.explanation) return null;
              return (
                <motion.div
                  key={el.id}
                  className="flex gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Info size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300">{el.explanation}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {!finished ? (
        <motion.button
          onClick={handleFinishEmail}
          className="w-full cyber-button-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Concluir Análise ({allSuspects.length - found.size} suspeitos restantes)
        </motion.button>
      ) : (
        <motion.div
          className="cyber-card text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {missedCount === 0 ? (
            <><CheckCircle size={32} className="text-cyber-green mx-auto mb-2" /><p className="text-cyber-green font-bold">Perfeito! Encontrou todos os elementos!</p></>
          ) : (
            <><p className="text-yellow-400 font-bold mb-1">Você perdeu {missedCount} elemento(s) suspeito(s)</p>
            <p className="text-slate-400 text-sm">Continue praticando para melhorar sua percepção.</p></>
          )}
          <motion.button
            onClick={handleNextEmail}
            className="mt-4 cyber-button-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {emailIndex >= EMAILS.length - 1 ? 'Ver Resultado Final' : 'Próximo E-mail'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
