import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trophy, RotateCcw, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: number;
  from: 'scammer' | 'player';
  text: string;
  isSafe?: boolean;
}

interface Choice {
  text: string;
  isSafe: boolean;
  consequence: string;
  nextStep: number;
}

interface Step {
  scammerMessage: string;
  choices: Choice[];
  isEnd?: boolean;
}

const SCENARIO: Step[] = [
  {
    scammerMessage: 'Oi! Sou seu primo João, troquei de número. Tá me salvando no contato?',
    choices: [
      { text: 'Claro! Oi João, como você está?', isSafe: false, consequence: 'Você confirmou a identidade sem verificar. Golpistas usam essa técnica para descobrir quem está na lista de contatos.', nextStep: 1 },
      { text: 'Deixa eu ligar pro número antigo pra confirmar que é você.', isSafe: true, consequence: 'Ótima atitude! Sempre confirme por outros meios antes de continuar.', nextStep: 2 },
      { text: 'Quem é João? Não te conheço.', isSafe: true, consequence: 'Boa resposta! Não revelar informações é sempre mais seguro com números desconhecidos.', nextStep: 2 },
    ],
  },
  {
    scammerMessage: 'Cara, tô numa situação difícil. Meu cartão foi bloqueado e preciso pagar uma conta urgente de R$800. Você pode me ajudar? Te devolvo amanhã.',
    choices: [
      { text: 'Claro, te mando agora pelo PIX!', isSafe: false, consequence: 'PERIGO! Você enviou dinheiro para um golpista. Nunca transfira dinheiro sem confirmar pessoalmente.', nextStep: 3 },
      { text: 'Preciso ligar pra você pra confirmar antes de qualquer coisa.', isSafe: true, consequence: 'Excelente! A ligação confirmaria se é realmente seu primo ou um golpista.', nextStep: 4 },
      { text: 'Não posso ajudar com dinheiro no momento.', isSafe: true, consequence: 'Resposta segura! Declinar pedidos de dinheiro inesperados é sempre prudente.', nextStep: 4 },
    ],
  },
  {
    scammerMessage: 'Boa ideia, mas meu novo número ainda não foi ativado para ligações. Pode me mandar só R$200 por enquanto? Depois te pago de volta com juros!',
    choices: [
      { text: 'Ok, mando R$200 então...', isSafe: false, consequence: 'Cuidado! "Não posso ligar" é um sinal clássico de golpe. Impedem verificação para pressionar o pagamento.', nextStep: 3 },
      { text: 'Se não posso ligar, não posso enviar dinheiro. Me adiciona depois que ativar.', isSafe: true, consequence: 'Perfeito! Você reconheceu a manobra para evitar verificação.', nextStep: 4 },
      { text: 'Vou chamar um parente em comum pra confirmar quem você é.', isSafe: true, consequence: 'Ótima estratégia! Sempre consulte outras pessoas da família para confirmar.', nextStep: 4 },
    ],
  },
  {
    scammerMessage: 'Não fica assim... Sou eu mesmo! Você não confia no seu próprio primo? Só R$100 pra me ajudar, por favor.',
    choices: [
      { text: 'Tá bem, mando R$100 para ajudar...', isSafe: false, consequence: 'Golpistas usam apelo emocional e culpa para pressionar as vítimas. Você foi manipulado(a).', nextStep: 3 },
      { text: 'Se você for meu primo, vai entender que preciso confirmar. Não vou enviar dinheiro sem isso.', isSafe: true, consequence: 'Muito bem! Manter-se firme mesmo sob pressão emocional é fundamental.', nextStep: 4 },
      { text: 'Vou bloquear este número e avisar minha família.', isSafe: true, consequence: 'Excelente! Bloquear e avisar os familiares impede que outras pessoas caiam no golpe.', nextStep: 4 },
    ],
  },
  {
    scammerMessage: '🎉 Você escapou do golpe! O "primo" era um golpista que usou técnicas de engenharia social para te manipular.',
    isEnd: true,
    choices: [],
  },
  {
    scammerMessage: '💸 Você caiu no golpe! O dinheiro foi enviado e nunca será devolvido. O golpista desapareceu.',
    isEnd: true,
    choices: [],
  },
];

interface Props {
  onComplete: (score: number) => void;
}

export default function GolpistaChat({ onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [choiceConsequence, setChoiceConsequence] = useState<{ text: string; isSafe: boolean } | null>(null);
  const [safeChoices, setSafeChoices] = useState(0);
  const [totalChoices, setTotalChoices] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial message
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([{ id: 1, from: 'scammer', text: SCENARIO[0].scammerMessage }]);
      }, 500);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const step = SCENARIO[currentStep];

  function handleChoice(choice: Choice) {
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now(), from: 'player', text: choice.text, isSafe: choice.isSafe },
    ];
    setMessages(newMessages);
    setTotalChoices(t => t + 1);
    if (choice.isSafe) setSafeChoices(s => s + 1);
    setChoiceConsequence({ text: choice.consequence, isSafe: choice.isSafe });

    setTimeout(() => {
      setChoiceConsequence(null);
      const nextStep = choice.nextStep;

      if (SCENARIO[nextStep].isEnd) {
        const isWin = nextStep === 4; // step 4 is the good ending
        setWon(isWin);
        setGameOver(true);
        setMessages(m => [...m, { id: Date.now() + 1, from: 'scammer', text: SCENARIO[nextStep].scammerMessage }]);
      } else {
        setCurrentStep(nextStep);
        setMessages(m => [...m, { id: Date.now() + 1, from: 'scammer', text: SCENARIO[nextStep].scammerMessage }]);
      }
    }, 2000);
  }

  const score = Math.round((safeChoices / Math.max(totalChoices, 1)) * 500);

  if (gameOver) {
    return (
      <motion.div className="max-w-xl mx-auto text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="cyber-card">
          <div className="text-6xl mb-4">{won ? '🛡️' : '😱'}</div>
          <h2 className="text-2xl font-black text-white mb-2">{won ? 'Missão Concluída!' : 'Golpe Aplicado!'}</h2>
          <div className="text-4xl font-black text-cyber-cyan mb-2">{won ? score : Math.round(score * 0.3)} pts</div>
          <p className={`mb-4 font-medium ${won ? 'text-cyber-green' : 'text-red-400'}`}>
            {won ? `${safeChoices}/${totalChoices} escolhas seguras` : 'Você foi vítima de engenharia social'}
          </p>

          <div className={`rounded-xl border p-4 mb-6 text-left ${won ? 'bg-cyber-green/10 border-cyber-green/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              {won ? <ShieldCheck size={18} className="text-cyber-green" /> : <AlertTriangle size={18} className="text-red-400" />}
              <span className={`font-bold ${won ? 'text-cyber-green' : 'text-red-400'}`}>
                {won ? 'Você se protegeu bem!' : 'O que deveria ter feito:'}
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              {won
                ? 'Você reconheceu as táticas de manipulação: urgência, apelo emocional e impedimento de verificação. Sempre confirme a identidade de quem pede dinheiro!'
                : 'Nunca transfira dinheiro para números desconhecidos. Sempre ligue para confirmar, mesmo que diga não poder atender. Consulte outros familiares antes de qualquer ação.'}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-bold text-white text-sm mb-2">Sinais do Golpe:</h4>
            <ul className="space-y-1 text-sm text-slate-400">
              <li>• Número desconhecido alegando ser familiar</li>
              <li>• Pedido urgente de dinheiro</li>
              <li>• Impossibilidade de ligação (para evitar verificação)</li>
              <li>• Apelo emocional e pressão de culpa</li>
              <li>• Oferta de devolver com juros</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => { setMessages([]); setCurrentStep(0); setChoiceConsequence(null); setSafeChoices(0); setTotalChoices(0); setGameOver(false); setTimeout(() => setMessages([{ id: 1, from: 'scammer', text: SCENARIO[0].scammerMessage }]), 300); }}
              className="cyber-button-secondary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw size={16} />Jogar Novamente
            </motion.button>
            <motion.button onClick={() => onComplete(won ? score : Math.round(score * 0.3))} className="cyber-button-primary flex items-center gap-2" whileHover={{ scale: 1.05 }}>
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-sm">
            👤
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Número Desconhecido</p>
            <p className="text-xs text-slate-500">+55 71 9 8765-4321</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">Seguro: </span>
          <span className="text-cyber-green font-bold text-sm">{safeChoices}/{totalChoices}</span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden mb-4">
        <div className="h-72 overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.from === 'player' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                  msg.from === 'scammer'
                    ? 'bg-slate-700 text-white rounded-tl-sm'
                    : msg.isSafe
                    ? 'bg-cyber-green/80 text-white rounded-tr-sm'
                    : 'bg-red-600/80 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Consequence Banner */}
        <AnimatePresence>
          {choiceConsequence && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mx-4 mb-2 rounded-xl border p-3 flex items-start gap-2 ${
                choiceConsequence.isSafe
                  ? 'bg-cyber-green/10 border-cyber-green/40'
                  : 'bg-red-500/10 border-red-500/40'
              }`}
            >
              {choiceConsequence.isSafe
                ? <CheckCircle size={16} className="text-cyber-green flex-shrink-0 mt-0.5" />
                : <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <p className={`text-xs ${choiceConsequence.isSafe ? 'text-green-300' : 'text-red-300'}`}>
                {choiceConsequence.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choices */}
        {!gameOver && !choiceConsequence && step && !step.isEnd && (
          <div className="p-4 pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2">Como você responde?</p>
            <div className="space-y-2">
              {step.choices.map((choice, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Send size={14} className="flex-shrink-0 text-slate-500" />
                  {choice.text}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
        <p className="text-xs text-yellow-400">
          <strong>Lembre-se:</strong> Esta é uma simulação fictícia. Nunca envie dinheiro para números desconhecidos sem verificação presencial ou por ligação.
        </p>
      </div>
    </div>
  );
}
