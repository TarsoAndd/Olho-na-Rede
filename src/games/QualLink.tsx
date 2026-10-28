import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, AlertTriangle, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight } from 'lucide-react';

interface LinkChallenge {
  id: number;
  question: string;
  links: { url: string; isMalicious: boolean; reason: string }[];
  explanation: string;
}

const CHALLENGES: LinkChallenge[] = [
  {
    id: 1,
    question: 'Você recebeu um e-mail do seu banco. Qual desses links você clicaria para acessar o site?',
    links: [
      { url: 'https://www.bradesco.com.br/login', isMalicious: false, reason: 'Domínio oficial e correto do Bradesco.' },
      { url: 'http://bradesco-conta.com/login', isMalicious: true, reason: 'Domínio diferente e sem HTTPS. Não é o site oficial.' },
      { url: 'https://bradesc0.com.br/acesso', isMalicious: true, reason: 'Usa zero "0" no lugar da letra "o" em bradesco.' },
      { url: 'https://bradesco.com.br.atualizar.net/login', isMalicious: true, reason: 'O domínio real é o que vem antes do .com.br. Aqui é "atualizar.net".' },
    ],
    explanation: 'Sempre verifique o domínio principal. O domínio real fica entre o último ponto antes do "/" e o "www" ou "https://". Prefira sempre digitar o endereço manualmente.',
  },
  {
    id: 2,
    question: 'Você quer comprar algo no Mercado Livre. Qual link parece seguro?',
    links: [
      { url: 'https://mercadolivre.com.br/produto/123', isMalicious: false, reason: 'Domínio oficial do Mercado Livre.' },
      { url: 'https://mercado-livre.shop/oferta', isMalicious: true, reason: 'Domínio com hífen e TLD diferente (.shop). Não é o site oficial.' },
      { url: 'https://bit.ly/ml-oferta-imperdivel', isMalicious: true, reason: 'Link encurtado oculta o destino real. Nunca use links encurtados para compras.' },
      { url: 'https://mercadoIivre.com.br/login', isMalicious: true, reason: 'Usa "I" maiúsculo no lugar do "l" minúsculo — quase imperceptível visualmente.' },
    ],
    explanation: 'Links encurtados e domínios com pequenas variações são técnicas comuns de phishing. Sempre prefira digitar o endereço diretamente no navegador ou usar favoritos.',
  },
  {
    id: 3,
    question: 'Qual desses links parece ser de um site seguro para inserir seus dados?',
    links: [
      { url: 'https://gov.br/minha-conta', isMalicious: false, reason: 'Domínio oficial do governo brasileiro com HTTPS.' },
      { url: 'http://gov-br-acesso.com/login', isMalicious: true, reason: 'Sem HTTPS e domínio falso imitando o gov.br.' },
      { url: 'https://minhaconta-gov.br/cpf', isMalicious: true, reason: 'O domínio real do governo é "gov.br", não "minhaconta-gov.br".' },
      { url: 'https://govbr.servicos.net/cpf', isMalicious: true, reason: 'Domínio .net tentando imitar o .gov.br oficial.' },
    ],
    explanation: 'Para serviços governamentais, o endereço sempre termina em .gov.br. O HTTPS (cadeado) é necessário mas não garante que o site é legítimo — golpistas também usam HTTPS.',
  },
  {
    id: 4,
    question: 'Você ganhou um cupom de desconto. Qual link parece legítimo?',
    links: [
      { url: 'https://ifood.com.br/cupom?code=DESC20', isMalicious: false, reason: 'Domínio oficial do iFood com parâmetro de cupom.' },
      { url: 'http://ifood-desconto.com/cupom20', isMalicious: true, reason: 'Domínio falso com hífen e sem HTTPS.' },
      { url: 'https://cutt.ly/ifood-cupom-50off', isMalicious: true, reason: 'Link encurtado oculta o destino real.' },
      { url: 'https://apps.ifood.com.br.cupom-gratis.xyz/login', isMalicious: true, reason: 'O domínio real é ".xyz", não ".com.br". Os prefixos "apps.ifood.com.br" são apenas subdomínios de um site malicioso.' },
    ],
    explanation: 'Cupons legítimos geralmente chegam por canais oficiais (app, e-mail oficial da empresa). Desconfie de ofertas recebidas por WhatsApp ou redes sociais com links encurtados.',
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export default function QualLink({ onComplete }: Props) {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const challenge = CHALLENGES[challengeIndex];
  const selectedLink = selected !== null ? challenge.links[selected] : null;
  const isCorrect = selectedLink ? !selectedLink.isMalicious : false;
  const pointsPerCorrect = 150;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = !challenge.links[idx].isMalicious;
    if (correct) setScore(s => s + pointsPerCorrect);
    setResults(r => [...r, correct]);
  }

  function handleNext() {
    if (challengeIndex >= CHALLENGES.length - 1) {
      setFinished(true);
    } else {
      setChallengeIndex(i => i + 1);
      setSelected(null);
    }
  }

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    return (
      <motion.div className="max-w-xl mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="cyber-card">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-black text-white mb-2">Análise Concluída!</h2>
          <div className="text-4xl font-black text-cyber-cyan mb-1">{score} pts</div>
          <p className="text-slate-400 mb-6">{correctCount}/{CHALLENGES.length} corretas</p>
          <div className="flex gap-3 justify-center">
            <motion.button onClick={() => { setChallengeIndex(0); setSelected(null); setScore(0); setResults([]); setFinished(false); }} className="cyber-button-secondary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
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
        <span className="text-slate-400 text-sm">Desafio {challengeIndex + 1} de {CHALLENGES.length}</span>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">{score} pts</span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" animate={{ width: `${(challengeIndex / CHALLENGES.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={challengeIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <div className="cyber-card mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Link size={20} className="text-cyber-cyan" />
              <h3 className="font-bold text-white">{challenge.question}</h3>
            </div>

            <div className="space-y-3">
              {challenge.links.map((link, idx) => {
                const isSelected = selected === idx;
                const showResult = selected !== null;
                const thisIsCorrect = !link.isMalicious;

                let borderClass = 'border-slate-600 hover:border-slate-400';
                let bgClass = 'bg-slate-800/60';

                if (showResult) {
                  if (thisIsCorrect) {
                    borderClass = 'border-cyber-green';
                    bgClass = 'bg-cyber-green/10';
                  } else {
                    borderClass = 'border-red-500/50';
                    bgClass = 'bg-red-500/10';
                  }
                } else if (isSelected) {
                  borderClass = 'border-cyber-cyan';
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${bgClass} ${borderClass} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
                    whileHover={selected === null ? { scale: 1.01 } : {}}
                    whileTap={selected === null ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {showResult ? (
                          thisIsCorrect ? <CheckCircle size={18} className="text-cyber-green" /> : <XCircle size={18} className="text-red-400" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-cyber-cyan bg-cyber-cyan' : 'border-slate-500'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <code className={`text-sm font-mono break-all ${showResult ? (thisIsCorrect ? 'text-cyber-green' : 'text-red-300') : 'text-slate-300'}`}>
                          {link.url}
                        </code>
                        {showResult && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-xs mt-1 ${thisIsCorrect ? 'text-green-400' : 'text-red-400'}`}
                          >
                            {link.reason}
                          </motion.p>
                        )}
                      </div>
                      {showResult && isSelected && (
                        <span className={`text-xs font-bold flex-shrink-0 ${isCorrect ? 'text-cyber-green' : 'text-red-400'}`}>
                          {isCorrect ? `+${pointsPerCorrect}` : '✗'}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 mb-4 ${isCorrect ? 'bg-cyber-green/10 border-cyber-green/40' : 'bg-red-500/10 border-red-500/40'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect
                  ? <><CheckCircle size={18} className="text-cyber-green" /><span className="font-bold text-cyber-green">Correto!</span></>
                  : <><AlertTriangle size={18} className="text-red-400" /><span className="font-bold text-red-400">Cuidado!</span></>
                }
              </div>
              <p className="text-slate-300 text-sm">{challenge.explanation}</p>
            </motion.div>
          )}

          {selected !== null && (
            <motion.button
              onClick={handleNext}
              className="w-full cyber-button-primary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {challengeIndex >= CHALLENGES.length - 1 ? 'Ver Resultado' : 'Próximo Desafio'}
              <ChevronRight size={18} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
