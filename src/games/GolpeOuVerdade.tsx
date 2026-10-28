import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';

interface Message {
  id: number;
  type: 'sms' | 'email' | 'whatsapp';
  sender: string;
  content: string;
  isScam: boolean;
  explanation: string;
  redFlags: string[];
}

const MESSAGES: Message[] = [
  {
    id: 1,
    type: 'sms',
    sender: '+55 0800 123 456',
    content: '⚠️ CORREIOS: Sua encomenda (código BR88231) está retida. Pague a taxa de R$12,90 em: bit.ly/correios-taxa URGENTE: vence hoje!',
    isScam: true,
    explanation: 'Este é um golpe! Os Correios nunca enviam SMS pedindo pagamento por link encurtado. Números 0800 não enviam SMS.',
    redFlags: ['Número de remetente suspeito', 'Link encurtado (bit.ly)', 'Urgência artificial', 'Pedido de pagamento por SMS'],
  },
  {
    id: 2,
    type: 'email',
    sender: 'noreply@nubank.com.br',
    content: 'Olá! Identificamos uma tentativa de acesso não autorizado à sua conta. Por segurança, sua conta foi temporariamente bloqueada. Acesse o app oficial do Nubank ou ligue 4020-0185 para desbloquear.',
    isScam: false,
    explanation: 'Esta parece uma comunicação legítima. O remetente é oficial, não pede dados por e-mail e orienta a usar o app ou número oficial.',
    redFlags: [],
  },
  {
    id: 3,
    type: 'whatsapp',
    sender: 'Promoções 🎁',
    content: '🎉 PARABÉNS! Você foi SELECIONADO para ganhar um iPhone 15 Pro! Clique agora: encr.pw/ganhe-iphone — Oferta expira em 1 hora! Compartilhe com 5 amigos para confirmar.',
    isScam: true,
    explanation: 'Golpe clássico de falso prêmio! Ninguém é "selecionado aleatoriamente" para ganhar iPhones. O link é suspeito e pede compartilhamento para se espalhar.',
    redFlags: ['Prêmio sem participar de sorteio', 'Link suspeito', 'Prazo artificial de 1 hora', 'Pede compartilhamento para se espalhar'],
  },
  {
    id: 4,
    type: 'email',
    sender: 'security@bradesc0.com.br',
    content: 'ATENÇÃO CLIENTE BRADESCO! Sua conta será cancelada em 24h. Atualize seus dados AGORA clicando aqui: bradesco-atualiza.net/dados',
    isScam: true,
    explanation: 'Phishing! O domínio "bradesc0.com.br" usa o número zero no lugar da letra "o". O domínio do link também é falso. O Bradesco real é bradesco.com.br.',
    redFlags: ['Domínio com caractere trocado (bradesc0)', 'Link para domínio diferente do banco', 'Ameaça de cancelamento', 'Urgência de 24h'],
  },
  {
    id: 5,
    type: 'sms',
    sender: 'Mercado Livre',
    content: 'Seu pedido #ML-2847291 foi enviado! Previsão de entrega: 28/10. Rastreie em mercadolivre.com.br/rastreio — Dúvidas? Chat: mercadolivre.com.br/ajuda',
    isScam: false,
    explanation: 'Comunicação legítima! O remetente é identificado, os links apontam para o domínio oficial do Mercado Livre e não pede nenhuma ação urgente ou pagamento.',
    redFlags: [],
  },
  {
    id: 6,
    type: 'whatsapp',
    sender: 'Mamãe ❤️',
    content: 'Oi meu amor! Troquei de número, esse é o novo. Estou em apuros, preciso que você me mande R$500 pelo PIX 123.456.789-00. Te explico depois, tô sem bateria!',
    isScam: true,
    explanation: 'Golpe do "Falso Familiar"! Nunca transfira dinheiro sem confirmar por ligação ou pessoalmente. Golpistas criam urgência e impedem confirmação.',
    redFlags: ['Número desconhecido alegando ser familiar', 'Pedido urgente de dinheiro', 'Desculpa para não poder ligar', 'Pressão emocional'],
  },
  {
    id: 7,
    type: 'email',
    sender: 'newsletter@spotify.com',
    content: 'Sua lista de Replay 2024 está pronta! Veja as músicas que você mais ouviu este ano. Acesse: open.spotify.com/wrapped',
    isScam: false,
    explanation: 'E-mail legítimo do Spotify! O remetente é do domínio oficial, o link aponta para o domínio real do Spotify e é uma campanha conhecida.',
    redFlags: [],
  },
];

interface Props {
  onComplete: (score: number) => void;
  currentScore?: number;
}

export default function GolpeOuVerdade({ onComplete, currentScore }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const message = MESSAGES[currentIndex];
  const isCorrect = selectedAnswer === message.isScam;
  const pointsPerCorrect = 100;

  function handleAnswer(isScam: boolean) {
    if (answered) return;
    setSelectedAnswer(isScam);
    setAnswered(true);
    const correct = isScam === message.isScam;
    if (correct) {
      setScore(s => s + pointsPerCorrect);
    }
    setResults(r => [...r, correct]);
  }

  function handleNext() {
    if (currentIndex >= MESSAGES.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setScore(0);
    setResults([]);
    setFinished(false);
  }

  if (finished) {
    const correctCount = results.filter(Boolean).length;
    const pct = Math.round((correctCount / MESSAGES.length) * 100);
    return (
      <motion.div
        className="max-w-xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="cyber-card">
          <div className="text-6xl mb-4">
            {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Missão Concluída!</h2>
          <div className="text-4xl font-black text-cyber-cyan mb-1">{score} pts</div>
          <p className="text-slate-400 mb-6">{correctCount}/{MESSAGES.length} corretas ({pct}%)</p>

          <div className="flex gap-2 justify-center mb-6">
            {results.map((r, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${r ? 'bg-cyber-green/20 border border-cyber-green text-cyber-green' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>
                {r ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <p className="text-slate-300 text-sm mb-6">
            {pct >= 80
              ? 'Excelente! Você tem um bom olhar para detectar golpes digitais.'
              : pct >= 60
              ? 'Bom trabalho! Continue praticando para melhorar ainda mais.'
              : 'Não desanime! Cada erro é uma oportunidade de aprendizado.'}
          </p>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={handleRestart}
              className="cyber-button-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={16} />
              Jogar Novamente
            </motion.button>
            <motion.button
              onClick={() => onComplete(score)}
              className="cyber-button-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy size={16} />
              Salvar Pontuação
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-sm">Mensagem {currentIndex + 1} de {MESSAGES.length}</span>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <span className="text-yellow-400 font-bold">{score} pts</span>
        </div>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
          animate={{ width: `${((currentIndex) / MESSAGES.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {/* Message Card */}
          <div className={`rounded-xl border p-5 mb-6 ${
            message.type === 'sms' ? 'bg-slate-800/60 border-slate-600' :
            message.type === 'email' ? 'bg-blue-950/40 border-blue-800/40' :
            'bg-green-950/30 border-green-800/30'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                message.type === 'sms' ? 'bg-gray-700 text-gray-300' :
                message.type === 'email' ? 'bg-blue-900/60 text-blue-300' :
                'bg-green-900/60 text-green-300'
              }`}>
                {message.type === 'sms' ? '📱 SMS' : message.type === 'email' ? '📧 E-mail' : '💬 WhatsApp'}
              </span>
              <span className="text-slate-400 text-sm font-mono">{message.sender}</span>
            </div>
            <p className="text-white leading-relaxed">{message.content}</p>
          </div>

          {/* Answer Buttons */}
          {!answered ? (
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <motion.button
                onClick={() => handleAnswer(true)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 text-red-400 font-bold text-lg hover:bg-red-500/20 hover:border-red-500 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle size={22} />
                É um Golpe!
              </motion.button>
              <motion.button
                onClick={() => handleAnswer(false)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-cyber-green/50 bg-cyber-green/10 text-cyber-green font-bold text-lg hover:bg-cyber-green/20 hover:border-cyber-green transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle size={22} />
                Parece Seguro
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-5 mb-4 ${
                isCorrect
                  ? 'bg-cyber-green/10 border-cyber-green/40'
                  : 'bg-red-500/10 border-red-500/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <><CheckCircle size={22} className="text-cyber-green" /><span className="font-bold text-cyber-green text-lg">Correto!</span></>
                ) : (
                  <><XCircle size={22} className="text-red-400" /><span className="font-bold text-red-400 text-lg">Errado!</span></>
                )}
                {isCorrect && <span className="ml-auto text-cyber-cyan font-bold">+{pointsPerCorrect} pts</span>}
              </div>

              <p className="text-slate-300 text-sm mb-3">{message.explanation}</p>

              {message.redFlags.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wide">Sinais de Alerta:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.redFlags.map((flag) => (
                      <span key={flag} className="text-xs bg-red-500/15 border border-red-500/30 text-red-300 rounded-full px-2 py-1">
                        ⚠ {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                onClick={handleNext}
                className="mt-4 w-full cyber-button-primary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentIndex >= MESSAGES.length - 1 ? 'Ver Resultado' : 'Próxima Mensagem'}
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
