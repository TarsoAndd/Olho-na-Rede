import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Trophy, Award, ChevronRight } from 'lucide-react';
import { UserProgress } from '../types';
import { unlockBadge, saveProgress } from '../store/progressStore';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Você recebe um SMS dizendo "Seu pacote está retido. Pague R$12,90 em: bit.ly/correios". O que fazer?',
    options: ['Clicar no link e pagar rapidamente para receber o pacote', 'Ignorar e verificar no site oficial dos Correios', 'Ligar para o número que enviou o SMS', 'Compartilhar com amigos para alertar sobre a encomenda'],
    correctIndex: 1,
    explanation: 'Os Correios nunca pedem pagamento por link encurtado. Sempre acesse o site oficial correios.com.br para verificar encomendas.',
    category: 'Phishing',
  },
  {
    id: 2,
    question: 'Qual desses elementos em um e-mail é mais suspeito?',
    options: ['Assinatura com nome da empresa', 'Link "clique aqui" apontando para domínio diferente do remetente', 'Saudação com seu nome completo', 'Rodapé com endereço físico da empresa'],
    correctIndex: 1,
    explanation: 'Um link que aponta para domínio diferente do remetente é um forte sinal de phishing. Sempre passe o mouse sobre links para ver o destino real.',
    category: 'Phishing',
  },
  {
    id: 3,
    question: 'Uma senha segura deve ter qual combinação?',
    options: ['Nome + data de nascimento (ex: joao1990)', 'Sequência simples com números (ex: 12345678)', 'Combinação de maiúsculas, minúsculas, números e símbolos com 12+ caracteres', 'Palavra do dicionário com um número no final'],
    correctIndex: 2,
    explanation: 'Uma senha forte precisa de comprimento (12+ caracteres) e variedade de tipos de caracteres. Evite informações pessoais e sequências previsíveis.',
    category: 'Senhas',
  },
  {
    id: 4,
    question: 'Qual URL é legítima para acessar o Bradesco?',
    options: ['bradesco-online.com.br', 'bradesc0.com.br', 'www.bradesco.com.br', 'bradesco.com.br.acesso.net'],
    correctIndex: 2,
    explanation: 'O único domínio oficial é bradesco.com.br. Os outros usam variações enganosas: hífen, número "0" no lugar de "o", ou adicionam domínios falsos após o real.',
    category: 'Links',
  },
  {
    id: 5,
    question: 'Você recebe mensagem de número desconhecido dizendo ser seu irmão pedindo PIX urgente. O que fazer?',
    options: ['Enviar o dinheiro, pois é urgente', 'Ligar para o número antigo do irmão para confirmar', 'Pedir foto do rosto por WhatsApp para confirmar', 'Enviar metade do valor para testar'],
    correctIndex: 1,
    explanation: 'Sempre confirme por outros meios antes de enviar dinheiro. Ligue para o número que você conhece, não para o número que enviou a mensagem.',
    category: 'Golpes',
  },
  {
    id: 6,
    question: 'O que é autenticação em dois fatores (2FA)?',
    options: ['Usar duas senhas diferentes na mesma conta', 'Código enviado ao celular além da senha para entrar na conta', 'Confirmar o login em dois dispositivos diferentes', 'Ter dois e-mails cadastrados na conta'],
    correctIndex: 1,
    explanation: 'O 2FA adiciona uma segunda camada de segurança. Mesmo que alguém roube sua senha, precisaria do código enviado ao seu celular para entrar.',
    category: 'Senhas',
  },
  {
    id: 7,
    question: 'Ao usar Wi-Fi público em um café, qual prática é mais segura?',
    options: ['Fazer transações bancárias normalmente, pois o local é confiável', 'Usar VPN e evitar acessar serviços sensíveis', 'Conectar apenas se a rede tiver uma senha', 'Acessar apenas sites com "http://"'],
    correctIndex: 1,
    explanation: 'Em redes públicas, use VPN para criptografar seu tráfego e evite acessar bancos ou inserir senhas. A senha na rede não garante privacidade entre usuários.',
    category: 'Wi-Fi',
  },
  {
    id: 8,
    question: 'Uma mensagem no WhatsApp diz "URGENTE: Governo vai bloquear PIX amanhã! Regularize: link.gov-br.net". O que é isso?',
    options: ['Aviso oficial do governo', 'Fake news com phishing para roubar dados bancários', 'Notícia verdadeira que você deve compartilhar', 'Comunicado do Banco Central'],
    correctIndex: 1,
    explanation: 'É um golpe clássico que usa fake news para criar pânico e direcionar vítimas a um site falso. Domínios governamentais legítimos terminam em .gov.br.',
    category: 'Fake News',
  },
  {
    id: 9,
    question: 'Qual é a melhor forma de gerenciar muitas senhas diferentes?',
    options: ['Escrever todas em um caderno físico', 'Usar a mesma senha para tudo, mas muito complexa', 'Usar um gerenciador de senhas confiável', 'Guardar em um arquivo de texto no computador'],
    correctIndex: 2,
    explanation: 'Gerenciadores de senhas (como Bitwarden, 1Password) criam e armazenam senhas únicas e complexas para cada conta, protegidas por uma única senha mestre.',
    category: 'Senhas',
  },
  {
    id: 10,
    question: 'Uma loja virtual oferece iPhone 15 por R$600. O site só aceita PIX. O que você faz?',
    options: ['Comprar imediatamente, é uma baita oferta', 'Pesquisar o site no Reclame Aqui e verificar o CNPJ antes de comprar', 'Comprar, mas enviar metade do valor antes', 'Pedir ao amigo para comprar e depois devolver o dinheiro'],
    correctIndex: 1,
    explanation: 'Preços muito abaixo do mercado e pagamento apenas por PIX são sinais de alerta. Sempre pesquise a empresa antes de comprar.',
    category: 'Compras',
  },
];

interface Props {
  progress: UserProgress;
  onProgressUpdate: (progress: UserProgress) => void;
}

function CertificateModal({ score, total, onClose }: { score: number; total: number; onClose: () => void }) {
  const pct = Math.round((score / total) * 100);
  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-lg w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Certificate */}
        <div className="bg-gradient-to-br from-cyber-dark via-cyber-navy to-cyber-blue rounded-3xl border-2 border-yellow-400/40 p-8 text-center shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(234, 179, 8, 0.2)' }}>
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400/50 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-400/50 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-400/50 rounded-br-lg" />

          <div className="text-5xl mb-4">🏆</div>
          <p className="text-yellow-400/80 text-xs uppercase tracking-widest mb-1">Certificado de Conclusão</p>
          <h2 className="text-2xl font-black text-white mb-1">CyberQuest</h2>
          <p className="text-cyber-cyan text-sm mb-6">Aprenda a Navegar com Segurança</p>

          <div className="border-t border-yellow-400/20 border-b py-4 mb-6">
            <p className="text-slate-400 text-sm mb-1">Pontuação obtida</p>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-cyber-cyan">
              {score}/{total}
            </div>
            <div className="text-xl font-bold text-yellow-400 mt-1">{pct}% de acertos</div>
          </div>

          <p className="text-slate-400 text-xs mb-1">Concluído em</p>
          <p className="text-white font-semibold mb-6">{date}</p>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {pct >= 80
              ? 'Parabéns! Você demonstrou excelente conhecimento sobre segurança digital e está preparado para navegar com segurança.'
              : pct >= 60
              ? 'Bom trabalho! Você tem uma boa base em segurança digital. Continue praticando para se aperfeiçoar.'
              : 'Você deu o primeiro passo importante! Continue praticando as missões para fortalecer seu conhecimento.'}
          </p>

          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={onClose}
              className="cyber-button-primary px-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Fechar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function QuizPage({ progress, onProgressUpdate }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const question = QUESTIONS[currentIndex];
  const isCorrect = selected === question.correctIndex;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
  }

  function handleNext() {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentIndex >= QUESTIONS.length - 1) {
      const score = newAnswers.filter((a, i) => a === QUESTIONS[i].correctIndex).length;
      let updated = { ...progress, quizCompleted: true, quizScore: score, quizTotal: QUESTIONS.length };

      if (score >= 8) {
        updated = unlockBadge(updated, 'quiz-master') as typeof updated;
      }
      // Add quiz score to total
      updated.totalScore = progress.totalScore + score * 50;
      saveProgress(updated);
      onProgressUpdate(updated);
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
    }
  }

  if (finished) {
    const correctCount = answers.filter((a, i) => a === QUESTIONS[i].correctIndex).length;
    const pct = Math.round((correctCount / QUESTIONS.length) * 100);

    return (
      <>
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-4">
              {pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Quiz Concluído!</h1>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-2">
              {correctCount}/{QUESTIONS.length}
            </div>
            <p className="text-slate-400 mb-8">{pct}% de acertos</p>

            {/* Results Grid */}
            <div className="flex gap-2 justify-center mb-6 flex-wrap">
              {QUESTIONS.map((q, i) => {
                const correct = answers[i] === q.correctIndex;
                return (
                  <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border ${
                    correct
                      ? 'bg-cyber-green/20 border-cyber-green text-cyber-green'
                      : 'bg-red-500/20 border-red-500 text-red-400'
                  }`}>
                    {correct ? '✓' : '✗'}
                  </div>
                );
              })}
            </div>

            {/* Detailed Results */}
            <div className="space-y-3 mb-8 text-left">
              {QUESTIONS.map((q, i) => {
                const userAnswer = answers[i];
                const correct = userAnswer === q.correctIndex;
                return (
                  <motion.div
                    key={q.id}
                    className={`rounded-xl border p-4 ${correct ? 'bg-cyber-green/5 border-cyber-green/20' : 'bg-red-500/5 border-red-500/20'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {correct ? <CheckCircle size={16} className="text-cyber-green flex-shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
                      <p className="text-white text-sm font-medium">{q.question}</p>
                    </div>
                    {!correct && (
                      <p className="text-xs text-slate-400 mt-1 ml-6">
                        <span className="text-red-400">Sua resposta: </span>{q.options[userAnswer!]}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1 ml-6">
                      <span className={correct ? 'text-cyber-green' : 'text-yellow-400'}>
                        {correct ? 'Correto! ' : 'Resposta: '}
                      </span>
                      {!correct && <span className="text-white">{q.options[q.correctIndex]} — </span>}
                      {q.explanation}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => { setCurrentIndex(0); setSelected(null); setAnswers([]); setFinished(false); }}
                className="cyber-button-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <RotateCcw size={16} />Jogar Novamente
              </motion.button>
              <motion.button
                onClick={() => setShowCertificate(true)}
                className="cyber-button-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Award size={16} />Ver Certificado
              </motion.button>
            </div>
          </motion.div>
        </div>

        {showCertificate && (
          <CertificateModal
            score={correctCount}
            total={QUESTIONS.length}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={20} className="text-yellow-400" />
          <h1 className="text-2xl font-black text-white">Quiz Final</h1>
        </div>
        <p className="text-slate-400 text-sm">Teste seus conhecimentos sobre segurança digital</p>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">Pergunta {currentIndex + 1} de {QUESTIONS.length}</span>
        <span className="text-xs bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan px-2 py-1 rounded-full">
          {question.category}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
          animate={{ width: `${(currentIndex / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <div className="cyber-card mb-4">
            <p className="text-white font-semibold text-lg leading-relaxed">{question.question}</p>
          </div>

          <div className="space-y-3 mb-4">
            {question.options.map((option, idx) => {
              const isSelected = selected === idx;
              const showResult = selected !== null;
              const isCorrectAnswer = idx === question.correctIndex;

              let cls = 'border-slate-600 bg-slate-800/60 hover:border-slate-400 hover:bg-slate-700/60';
              if (showResult) {
                if (isCorrectAnswer) cls = 'border-cyber-green bg-cyber-green/10';
                else if (isSelected && !isCorrectAnswer) cls = 'border-red-500 bg-red-500/10';
                else cls = 'border-slate-700 bg-slate-800/40 opacity-60';
              } else if (isSelected) {
                cls = 'border-cyber-cyan bg-cyber-cyan/10';
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${cls} flex items-center gap-3`}
                  whileHover={selected === null ? { scale: 1.01 } : {}}
                  whileTap={selected === null ? { scale: 0.99 } : {}}
                >
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    showResult && isCorrectAnswer ? 'border-cyber-green bg-cyber-green text-white' :
                    showResult && isSelected && !isCorrectAnswer ? 'border-red-500 bg-red-500 text-white' :
                    isSelected ? 'border-cyber-cyan bg-cyber-cyan text-white' :
                    'border-slate-500 text-slate-500'
                  }`}>
                    {showResult && isCorrectAnswer ? '✓' : showResult && isSelected ? '✗' : String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm text-slate-200">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 mb-4 ${isCorrect ? 'bg-cyber-green/10 border-cyber-green/30' : 'bg-red-500/10 border-red-500/30'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect
                  ? <><CheckCircle size={16} className="text-cyber-green" /><span className="text-cyber-green font-bold text-sm">Correto!</span></>
                  : <><XCircle size={16} className="text-red-400" /><span className="text-red-400 font-bold text-sm">Incorreto!</span></>
                }
              </div>
              <p className="text-slate-300 text-sm">{question.explanation}</p>
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
              {currentIndex >= QUESTIONS.length - 1 ? 'Ver Resultado' : 'Próxima Pergunta'}
              <ChevronRight size={18} />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
