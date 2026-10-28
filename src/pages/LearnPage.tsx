import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Eye, Shield } from 'lucide-react';

interface LearnTopic {
  id: string;
  icon: string;
  title: string;
  color: string;
  borderColor: string;
  summary: string;
  explanation: string;
  example: string;
  redFlags: string[];
  tips: string[];
}

const TOPICS: LearnTopic[] = [
  {
    id: 'phishing',
    icon: '🎣',
    title: 'Phishing',
    color: 'from-red-500/20 to-red-700/10',
    borderColor: 'border-red-500/30',
    summary: 'Tentativas de roubar seus dados através de mensagens falsas',
    explanation: 'Phishing é quando golpistas enviam e-mails, SMS ou mensagens fingindo ser empresas, bancos ou serviços legítimos para obter seus dados pessoais, senhas ou informações financeiras.',
    example: 'Você recebe um e-mail do "Banco Itaú" pedindo para atualizar seus dados. O link leva a um site idêntico ao do banco, mas falso, que captura sua senha.',
    redFlags: ['Remetente com domínio errado ou suspeito', 'Links diferentes do site oficial', 'Urgência ou ameaça de cancelamento', 'Pedido de dados pessoais por e-mail', 'Erros de ortografia e gramática'],
    tips: ['Nunca clique em links de e-mails suspeitos', 'Acesse o site digitando o endereço manualmente', 'Verifique o remetente com atenção', 'Em caso de dúvida, ligue para a empresa oficialmente'],
  },
  {
    id: 'whatsapp-scams',
    icon: '💬',
    title: 'Golpes no WhatsApp',
    color: 'from-green-500/20 to-green-700/10',
    borderColor: 'border-green-500/30',
    summary: 'Fraudes que acontecem via aplicativos de mensagem',
    explanation: 'Os golpes no WhatsApp incluem o "golpe do número novo" (familiar pedindo dinheiro), ofertas falsas de emprego, promoções inexistentes e clonagem de perfis para enganar contatos.',
    example: '"Oi mãe, troquei de número! Precisando de R$500 urgente para pagar uma conta. Me manda o PIX que te explico depois."',
    redFlags: ['Pedidos de dinheiro urgentes de números novos', 'Incapacidade de ligar para confirmar identidade', 'Ofertas de emprego sem entrevista', 'Promoções com prazo muito curto'],
    tips: ['Sempre ligue para confirmar antes de enviar dinheiro', 'Desconfie de contatos novos que pedem favores', 'Nunca compartilhe códigos de verificação', 'Configure senha no WhatsApp'],
  },
  {
    id: 'social-engineering',
    icon: '🎭',
    title: 'Engenharia Social',
    color: 'from-purple-500/20 to-purple-700/10',
    borderColor: 'border-purple-500/30',
    summary: 'Manipulação psicológica para obter informações ou dinheiro',
    explanation: 'Engenharia social é a arte de manipular pessoas para que revelem informações confidenciais ou realizem ações que beneficiem o golpista. Explora emoções como medo, urgência e confiança.',
    example: 'Ligação de suposto funcionário do banco dizendo que sua conta foi comprometida e pedindo para você instalar um "aplicativo de segurança" (que é um malware).',
    redFlags: ['Pressão para agir imediatamente', 'Apelos emocionais (medo, ganância, compaixão)', 'Pedidos de informações confidenciais por telefone', 'Promessas de benefícios exclusivos'],
    tips: ['Nunca forneça senhas ou códigos por telefone', 'Bancos nunca pedem instalação de apps por telefone', 'Desligue e ligue para o número oficial', 'Verifique com calma sem se deixar pressionar'],
  },
  {
    id: 'data-breach',
    icon: '💾',
    title: 'Vazamento de Dados',
    color: 'from-orange-500/20 to-orange-700/10',
    borderColor: 'border-orange-500/30',
    summary: 'Exposição de suas informações pessoais na internet',
    explanation: 'Vazamentos ocorrem quando empresas têm seus bancos de dados invadidos e as informações de clientes são expostas. Esses dados são vendidos na dark web e usados para golpes.',
    example: 'Seus dados (CPF, e-mail, telefone) vazam de uma loja virtual invadida. Golpistas usam essas informações para criar abordagens convincentes e personalizadas.',
    redFlags: ['Contatos que sabem informações suas que não deveriam saber', 'E-mails sobre contas que você não criou', 'Cobranças de serviços não contratados'],
    tips: ['Use o site haveibeenpwned.com para verificar vazamentos', 'Use e-mails diferentes para cada tipo de serviço', 'Ative autenticação em dois fatores em todas as contas', 'Monitore seu CPF em consultas de crédito'],
  },
  {
    id: 'passwords',
    icon: '🔐',
    title: 'Senhas e Autenticação',
    color: 'from-cyan-500/20 to-cyan-700/10',
    borderColor: 'border-cyan-500/30',
    summary: 'Como proteger o acesso às suas contas digitais',
    explanation: 'Senhas fracas ou reutilizadas são uma das maiores vulnerabilidades. Atacantes usam ferramentas que testam milhões de combinações por segundo para invadir contas.',
    example: 'Você usa "joao123" em 5 contas diferentes. Um site é invadido, sua senha vaza, e o golpista acessa todas as outras contas com as mesmas credenciais.',
    redFlags: ['Senhas curtas (menos de 10 caracteres)', 'Uso de informações pessoais na senha', 'Mesma senha em múltiplos serviços', 'Sem autenticação de dois fatores'],
    tips: ['Use um gerenciador de senhas (Bitwarden, 1Password)', 'Ative 2FA em todas as contas importantes', 'Crie senhas com 12+ caracteres misturando tipos', 'Nunca compartilhe senhas, mesmo com familiares'],
  },
  {
    id: 'public-wifi',
    icon: '📡',
    title: 'Redes Wi-Fi Públicas',
    color: 'from-blue-500/20 to-blue-700/10',
    borderColor: 'border-blue-500/30',
    summary: 'Riscos ao usar internet em lugares públicos',
    explanation: 'Redes Wi-Fi públicas podem ser monitoradas por terceiros ou até criadas por golpistas para interceptar tráfego. Em redes abertas, seus dados podem ser capturados.',
    example: 'Você se conecta ao "WiFi_Shopping_Free" em um shopping. Na verdade, é uma rede falsa criada por um hacker que intercepta todos os seus dados de navegação.',
    redFlags: ['Redes sem senha em lugares públicos', 'Nomes de redes que imitam lugares conhecidos', 'Solicitação de cadastro para acessar a rede', 'Conexão lenta ou instável'],
    tips: ['Evite acessar bancos em Wi-Fi público', 'Use VPN ao se conectar a redes públicas', 'Prefira usar os dados do celular para transações', 'Desative a conexão automática a redes Wi-Fi'],
  },
  {
    id: 'online-shopping',
    icon: '🛒',
    title: 'Compras Online',
    color: 'from-yellow-500/20 to-yellow-700/10',
    borderColor: 'border-yellow-500/30',
    summary: 'Como comprar com segurança na internet',
    explanation: 'Lojas virtuais falsas, vendedores desonestos em marketplaces e promoções inexistentes são armadilhas comuns em compras online. O prejuízo pode ir além do dinheiro — seus dados também são roubados.',
    example: 'Você encontra um site com iPhone por R$500. Paga via PIX, e nunca recebe o produto. O site desaparece em poucos dias.',
    redFlags: ['Preços muito abaixo do mercado', 'Site sem CNPJ, endereço ou telefone', 'Aceitam apenas PIX ou boleto (sem cartão)', 'Site criado recentemente (verifique em whois)'],
    tips: ['Pesquise o site no Reclame Aqui e Google', 'Verifique se tem HTTPS e cadeado no navegador', 'Prefira pagar com cartão de crédito (maior proteção)', 'Consulte o CNPJ no site da Receita Federal'],
  },
  {
    id: 'fake-news',
    icon: '📰',
    title: 'Fake News e Desinformação',
    color: 'from-pink-500/20 to-pink-700/10',
    borderColor: 'border-pink-500/30',
    summary: 'Como identificar e combater informações falsas',
    explanation: 'Fake news são notícias fabricadas ou distorcidas criadas para manipular opiniões, gerar cliques, espalhar pânico ou legitimar golpes. Na era digital, se propagam rapidamente.',
    example: 'Uma mensagem no WhatsApp diz que "o governo vai bloquear todos os PIX amanhã" com link para "regularizar". O link é phishing para roubar seus dados bancários.',
    redFlags: ['Manchetes sensacionalistas demais', 'Ausência de fonte ou autoria', 'Conteúdo que gera muito medo ou revolta', 'Pedido de "compartilhe urgente"'],
    tips: ['Verifique em sites de fact-checking (Agência Lupa, AosFatos)', 'Busque a notícia em múltiplas fontes confiáveis', 'Desconfie de conteúdo sem data ou autor', 'Não compartilhe antes de verificar'],
  },
];

interface TopicCardProps {
  topic: LearnTopic;
  isOpen: boolean;
  onToggle: () => void;
}

function TopicCard({ topic, isOpen, onToggle }: TopicCardProps) {
  return (
    <motion.div
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${topic.color} ${topic.borderColor}`}
      layout
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-3xl flex-shrink-0">{topic.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg">{topic.title}</h3>
          <p className="text-slate-400 text-sm truncate">{topic.summary}</p>
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-5 space-y-5">
              {/* Explanation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={16} className="text-cyber-cyan" />
                  <span className="text-cyber-cyan font-semibold text-sm uppercase tracking-wide">O que é</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{topic.explanation}</p>
              </div>

              {/* Example */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 font-semibold text-sm">💡 Exemplo prático</span>
                </div>
                <p className="text-yellow-200/80 text-sm leading-relaxed">{topic.example}</p>
              </div>

              {/* Red Flags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">Sinais de Alerta</span>
                </div>
                <ul className="space-y-1.5">
                  {topic.redFlags.map((flag) => (
                    <li key={flag} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">⚠</span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-cyber-green" />
                  <span className="text-cyber-green font-semibold text-sm uppercase tracking-wide">Como se Proteger</span>
                </div>
                <ul className="space-y-1.5">
                  {topic.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle size={14} className="text-cyber-green flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LearnPage() {
  const [openTopic, setOpenTopic] = useState<string | null>('phishing');

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-black text-white mb-3">
          Aprenda a se Proteger
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Conheça os principais perigos digitais, como identificá-los e as melhores formas de se defender
        </p>
      </motion.div>

      <div className="space-y-3">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <TopicCard
              topic={topic}
              isOpen={openTopic === topic.id}
              onToggle={() => setOpenTopic(openTopic === topic.id ? null : topic.id)}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 glass-card p-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-4xl mb-3">🛡️</div>
        <h3 className="font-bold text-white text-lg mb-2">Recursos Oficiais</h3>
        <p className="text-slate-400 text-sm mb-4">Para se aprofundar ainda mais em segurança digital</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            { name: 'SaferNet Brasil', desc: 'Centro de atendimento a crimes online', url: 'safernet.org.br' },
            { name: 'CERT.br', desc: 'Centro de Estudos e Resposta a Incidentes', url: 'cert.br' },
            { name: 'Agência Lupa', desc: 'Verificação de fatos e fake news', url: 'lupa.uol.com.br' },
            { name: 'Have I Been Pwned', desc: 'Verifique se seus dados vazaram', url: 'haveibeenpwned.com' },
          ].map((resource) => (
            <div key={resource.name} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <p className="text-white font-semibold text-sm">{resource.name}</p>
              <p className="text-slate-400 text-xs">{resource.desc}</p>
              <p className="text-cyber-cyan text-xs mt-1 font-mono">{resource.url}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
