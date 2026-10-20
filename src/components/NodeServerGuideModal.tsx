import { useState } from 'react';
import {
  X,
  Database,
  Server,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Layers,
  Sparkles,
} from 'lucide-react';

interface NodeServerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NodeServerGuideModal({ isOpen, onClose }: NodeServerGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'mongo' | 'code' | 'run' | 'cloud'>('mongo');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const packageJsonCode = `{
  "name": "leads-server",
  "version": "1.0.0",
  "description": "Servidor Node.js para receber e salvar leads do Quiz Feminino no MongoDB Atlas",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^8.3.2"
  }
}`;

  const envCode = `# Configurações do Servidor
PORT=5000

# String de Conexão obtida no MongoDB Atlas (substitua com suas credenciais):
MONGO_URI=mongodb+srv://usuario_leads:SuaSenhaForte123@cluster0.abcde.mongodb.net/leads_quiz?retryWrites=true&w=majority
`;

  const serverJsCode = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Middlewares: Permite receber JSON e requisições de outros domínios (CORS)
app.use(cors());
app.use(express.json());

// 2. Conexão com o MongoDB Atlas (Nuvem)
if (!MONGO_URI) {
  console.error('❌ ERRO: A variável MONGO_URI não foi definida no arquivo .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('🍃 Conectado com sucesso ao MongoDB Atlas (Nuvem)!'))
  .catch((err) => console.error('❌ Falha ao conectar ao MongoDB:', err.message));

// 3. Definição do Modelo de Dados (Mongoose Schema)
const LeadSchema = new mongoose.Schema(
  {
    lead: {
      nome: { type: String, required: true },
      whatsapp: { type: String, required: true },
      email: { type: String, required: true },
      optInWhatsApp: { type: Boolean, default: true },
      submittedAt: { type: Date, default: Date.now },
    },
    quizAnswers: [
      {
        questionId: Number,
        question: String,
        optionId: String,
        answer: String,
      },
    ],
    diagnostic: {
      title: String,
      tagline: String,
      statusBadge: String,
      frizzLevel: String,
      summary: String,
      customTips: [String],
      recommendedHabit: String,
    },
    metadata: {
      source: String,
      campaign: String,
      origin: String,
      userAgent: String,
      timestamp: Number,
    },
  },
  { timestamps: true }
);

const LeadModel = mongoose.model('HairLead', LeadSchema);

// 4. Rotas da API

// Rota de status para verificar se o servidor está online
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Servidor de Leads Anti-Frizz Toque da Beleza rodando!',
    timestamp: new Date().toISOString(),
  });
});

// Rota POST: Recebe o lead enviado pelo Quiz e salva no MongoDB
app.post('/api/leads', async (req, res) => {
  try {
    const { lead, quizAnswers, diagnostic, metadata } = req.body;

    if (!lead || !lead.nome || !lead.whatsapp || !lead.email) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios ausentes (nome, whatsapp ou email).',
      });
    }

    const novoLead = new LeadModel({
      lead,
      quizAnswers,
      diagnostic,
      metadata,
    });

    const leadSalvo = await novoLead.save();

    console.log(\`✨ Novo Lead Anti-Frizz: \${lead.nome} (\${lead.whatsapp}) - Frizz: \${diagnostic?.frizzLevel || 'N/A'}\`);

    return res.status(201).json({
      success: true,
      message: 'Lead recebido e gravado no MongoDB com sucesso!',
      id: leadSalvo._id,
    });
  } catch (error) {
    console.error('❌ Erro ao salvar lead:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar lead no banco de dados.',
    });
  }
});

// Rota GET: Lista os leads cadastrados (Útil para você consultar seus contatos!)
app.get('/api/leads', async (req, res) => {
  try {
    const leads = await LeadModel.find().sort({ createdAt: -1 });
    res.json({
      total: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar leads.' });
  }
});

// 5. Inicialização do Servidor
app.listen(PORT, () => {
  console.log(\`🚀 Servidor Node.js rodando em http://localhost:\${PORT}\`);
  console.log(\`📥 Rota para envio do Quiz: POST http://localhost:\${PORT}/api/leads\`);
  console.log(\`📋 Rota para ver os leads: GET http://localhost:\${PORT}/api/leads\`);
});
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Como Criar o Servidor Node.js + MongoDB na Nuvem</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                  100% Gratuito
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Guia completo e descomplicado para você subir seu banco de dados na nuvem e o backend
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 bg-stone-950 border-b border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('mongo')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'mongo'
                ? 'border-rose-500 text-rose-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>1. MongoDB na Nuvem (Atlas)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'border-rose-500 text-rose-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4 text-rose-400" />
            <span>2. Códigos Prontos do Servidor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('run')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'run'
                ? 'border-rose-500 text-rose-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>3. Como Rodar no Computador</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`pb-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cloud'
                ? 'border-rose-500 text-rose-300 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>4. Hospedar na Nuvem (Opcional)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-stone-300">
          {/* TAB 1: MONGODB ATLAS NA NUVEM */}
          {activeTab === 'mongo' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3.5">
                <Database className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-emerald-300">
                    O que é o MongoDB Atlas na Nuvem?
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    É o serviço oficial do MongoDB hospedado na nuvem. Ele oferece um plano gratuito vitalício
                    (<strong>M0 Free Cluster</strong>, com 512 MB de armazenamento) que é mais do que suficiente para
                    guardar dezenas de milhares de leads sem pagar 1 centavo e sem precisar instalar o MongoDB na sua máquina.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Passo a Passo de Criação no MongoDB Atlas:
                </h4>

                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white text-sm">Criar a Conta Gratuita</h5>
                    <p className="text-xs text-stone-400 mt-1">
                      Acesse o site oficial do MongoDB Atlas e faça login ou crie uma conta gratuita (pode usar o Google):
                    </p>
                    <a
                      href="https://www.mongodb.com/cloud/atlas/register"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold mt-2 underline"
                    >
                      <span>Abrir mongodb.com/cloud/atlas</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white text-sm">Criar um Cluster M0 (Free / Gratuito)</h5>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      No painel, clique no botão verde <strong>"Create Database"</strong> ou <strong>"Build a Database"</strong>.<br />
                      Selecione a opção <strong>M0 (Free)</strong>. Escolha o provedor <em>AWS</em> e uma região próxima (ex: <code>sa-east-1 São Paulo</code> ou <code>us-east-1 N. Virginia</code>). Deixe o nome padrão (Cluster0) e confirme.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white text-sm">Criar Usuário e Senha do Banco (Database User)</h5>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      O assistente pedirá para você criar um usuário. Escolha:
                      <br />• <strong>Username</strong>: ex: <code>admin_leads</code>
                      <br />• <strong>Password</strong>: crie uma senha segura (ex: <code>SenhaSegura123!</code>). <em>Guarde bem essa senha!</em>
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white text-sm">Liberar Acesso de Rede (Network Access)</h5>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      No menu lateral esquerdo, vá em <strong>Security &gt; Network Access</strong>.<br />
                      Clique em <strong>"Add IP Address"</strong> e selecione <strong>"Allow Access from Anywhere"</strong> (isso preenche com <code>0.0.0.0/0</code>).<br />
                      Assim seu servidor Node.js conseguirá se conectar sem bloqueios.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex gap-3.5">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div className="flex-1">
                    <h5 className="font-semibold text-white text-sm">Copiar a String de Conexão (MONGO_URI)</h5>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      No painel inicial (Databases), clique no botão <strong>"Connect"</strong> ao lado do seu Cluster.<br />
                      Escolha a opção <strong>"Drivers" (Node.js)</strong>.<br />
                      Você receberá uma URL parecida com:
                    </p>
                    <div className="mt-2 p-2.5 bg-stone-900 rounded-lg font-mono text-xs text-emerald-300 border border-stone-800 break-all">
                      mongodb+srv://admin_leads:&lt;password&gt;@cluster0.abcde.mongodb.net/leads_quiz?retryWrites=true&w=majority
                    </div>
                    <p className="text-[11px] text-amber-300 mt-1.5">
                      ⚠️ <strong>Atenção:</strong> Substitua <code>&lt;password&gt;</code> pela senha que você criou no passo 3!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CÓDIGO PRONTO DO SERVIDOR */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <p className="text-xs text-stone-400">
                Criamos a estrutura completa do servidor Node.js com Express e Mongoose para você. São apenas 3 arquivos.
                Basta copiá-los para uma pasta no seu computador:
              </p>

              {/* File 1: server.js */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950">
                <div className="bg-stone-900 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-rose-300 flex items-center gap-2">
                    <span>📄 server.js</span>
                    <span className="text-[11px] text-stone-500 font-sans">(Código principal da API)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(serverJsCode, 'server')}
                    className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedFile === 'server' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar server.js</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-72 leading-relaxed">
                  <code>{serverJsCode}</code>
                </pre>
              </div>

              {/* File 2: .env */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950">
                <div className="bg-stone-900 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-2">
                    <span>📄 .env</span>
                    <span className="text-[11px] text-stone-500 font-sans">(Variáveis de Ambiente & Banco)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(envCode, 'env')}
                    className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedFile === 'env' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar .env</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
                  <code>{envCode}</code>
                </pre>
              </div>

              {/* File 3: package.json */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950">
                <div className="bg-stone-900 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-emerald-300 flex items-center gap-2">
                    <span>📄 package.json</span>
                    <span className="text-[11px] text-stone-500 font-sans">(Dependências do Node)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode(packageJsonCode, 'pkg')}
                    className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedFile === 'pkg' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar package.json</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-emerald-200 overflow-x-auto leading-relaxed">
                  <code>{packageJsonCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: COMO RODAR NO COMPUTADOR */}
          {activeTab === 'run' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  Pré-requisito: Node.js instalado
                </h4>
                <p className="text-xs text-stone-400">
                  Se você ainda não tem o Node.js no seu computador, baixe gratuitamente a versão LTS em{' '}
                  <a
                    href="https://nodejs.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-400 underline font-semibold"
                  >
                    nodejs.org
                  </a>.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Comandos no Terminal (Basta Executar em Sequência):
                </h4>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-200 space-y-3">
                  <div>
                    <span className="text-stone-500"># 1. Crie uma pasta para o projeto e entre nela:</span>
                    <p className="text-rose-300 font-semibold">mkdir servidor-leads-quiz</p>
                    <p className="text-rose-300 font-semibold">cd servidor-leads-quiz</p>
                  </div>

                  <div>
                    <span className="text-stone-500"># 2. Crie os 3 arquivos (package.json, .env e server.js) copiando da aba anterior</span>
                  </div>

                  <div>
                    <span className="text-stone-500"># 3. Instale as dependências (express, mongoose, cors, dotenv):</span>
                    <p className="text-emerald-300 font-semibold">npm install</p>
                  </div>

                  <div>
                    <span className="text-stone-500"># 4. Inicie o servidor:</span>
                    <p className="text-emerald-300 font-semibold">node server.js</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 space-y-1">
                  <p className="font-semibold text-emerald-300">✅ O que você verá no seu terminal ao iniciar:</p>
                  <p className="font-mono text-stone-300">🚀 Servidor Node.js rodando em http://localhost:5000</p>
                  <p className="font-mono text-stone-300">🍃 Conectado com sucesso ao MongoDB Atlas (Nuvem)!</p>
                  <p className="font-mono text-stone-300">📥 Rota para envio do Quiz: POST http://localhost:5000/api/leads</p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300">
                  <p className="font-semibold text-white">Como testar se está funcionando:</p>
                  <p className="text-stone-400 mt-1">
                    Com o servidor rodando, volte no Quiz e clique em <strong>"Reenviar Teste"</strong> ou faça o quiz novamente.
                    O app enviará os dados e você verá o lead sendo impresso no terminal e salvo no MongoDB Atlas!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEPLOY GRATUITO NA NUVEM */}
          {activeTab === 'cloud' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
                <Cloud className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-cyan-300">
                    Quer deixar seu servidor rodando na internet 24h por dia?
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Você pode hospedar este mesmo código em serviços gratuitos como <strong>Render.com</strong> ou <strong>Railway.app</strong>.
                    Assim você ganha uma URL pública (como <code>https://meu-quiz-leads.onrender.com/api/leads</code>) para receber leads de qualquer lugar do mundo!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Hospedagem no Render.com (Grátis):
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-stone-300 bg-stone-950 p-4 rounded-xl border border-stone-800 leading-relaxed">
                  <li>Suba a pasta do seu servidor para um repositório no seu GitHub.</li>
                  <li>Acesse <strong>render.com</strong> e crie uma conta gratuita.</li>
                  <li>Clique em <strong>New +</strong> e selecione <strong>Web Service</strong>.</li>
                  <li>Conecte seu repositório do GitHub.</li>
                  <li>
                    Nas variáveis de ambiente (Environment Variables), adicione a chave <code>MONGO_URI</code> com a sua string do Atlas.
                  </li>
                  <li>Clique em <strong>Create Web Service</strong> e pronto!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-rose-400">
            <Sparkles className="w-4 h-4" />
            <span>Tudo preparado para a sua transição sem fricção.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
}
