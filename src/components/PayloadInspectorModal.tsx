import { useState } from 'react';
import { X, Copy, Check, Terminal, Globe, Send, Play } from 'lucide-react';
import { LeadPayload } from '../types';

interface PayloadInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: LeadPayload;
  serverEndpoint: string;
  onUpdateEndpoint: (newEndpoint: string) => void;
}

export function PayloadInspectorModal({
  isOpen,
  onClose,
  payload,
  serverEndpoint,
  onUpdateEndpoint,
}: PayloadInspectorModalProps) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [customUrl, setCustomUrl] = useState(serverEndpoint);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    statusCode?: number;
    responseTime?: number;
    message?: string;
  }>({ status: 'idle' });

  if (!isOpen) return null;

  const jsonString = JSON.stringify(payload, null, 2);

  const curlCommand = `curl -X POST "${customUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(payload)}'`;

  const copyToClipboard = (text: string, type: 'json' | 'curl') => {
    navigator.clipboard.writeText(text);
    if (type === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const handleTestDispatch = async () => {
    setTestResult({ status: 'loading' });
    const startTime = performance.now();

    try {
      const response = await fetch(customUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const elapsed = Math.round(performance.now() - startTime);
      const text = await response.text();

      if (response.ok) {
        setTestResult({
          status: 'success',
          statusCode: response.status,
          responseTime: elapsed,
          message: text || 'Servidor respondeu OK! Lead gravado com sucesso.',
        });
      } else {
        setTestResult({
          status: 'error',
          statusCode: response.status,
          responseTime: elapsed,
          message: `Erro do servidor (${response.status}): ${text || 'Falha na requisição'}`,
        });
      }
    } catch (err: unknown) {
      const elapsed = Math.round(performance.now() - startTime);
      const msg =
        err instanceof Error
          ? err.message
          : 'Não foi possível conectar. O servidor Node.js ainda não está rodando nesta porta.';
      setTestResult({
        status: 'error',
        statusCode: 0,
        responseTime: elapsed,
        message: `${msg} (Dica: Inicie seu servidor com "node server.js" na porta 5000)`,
      });
    }
  };

  const handleApplyUrl = () => {
    onUpdateEndpoint(customUrl.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Inspecionar Payload de Envio (JSON & Node.js)
              </h2>
              <p className="text-xs text-stone-400">
                Veja os dados que o Quiz envia via requisição HTTP POST para o seu backend
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Endpoint Configuration Bar */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-rose-400" />
                Endpoint do Servidor Node.js
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                MÉTODO POST
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="http://localhost:5000/api/leads"
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-rose-400"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Salvar Endpoint
              </button>
              <button
                type="button"
                onClick={handleTestDispatch}
                disabled={testResult.status === 'loading'}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {testResult.status === 'loading' ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Disparar Teste Agora</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Execution Output */}
            {testResult.status !== 'idle' && (
              <div
                className={`p-3 rounded-lg text-xs font-mono mt-2 border ${
                  testResult.status === 'success'
                    ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : testResult.status === 'error'
                    ? 'bg-amber-950/40 border-amber-700 text-amber-200'
                    : 'bg-stone-900 border-stone-700 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-semibold">
                  <span>
                    {testResult.status === 'success'
                      ? '✅ Resposta recebida do servidor'
                      : testResult.status === 'error'
                      ? '⚠️ Aviso / Servidor não alcançado'
                      : '⏳ Disparando requisição HTTP...'}
                  </span>
                  {testResult.responseTime && (
                    <span className="text-[11px] opacity-80">{testResult.responseTime}ms</span>
                  )}
                </div>
                <p className="opacity-90">{testResult.message}</p>
              </div>
            )}
          </div>

          {/* JSON Payload Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Corpo da Requisição (JSON Payload)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(jsonString, 'json')}
                className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-rose-300 overflow-x-auto max-h-72 leading-relaxed">
                <code>{jsonString}</code>
              </pre>
            </div>
          </div>

          {/* cURL Command for Terminal Testing */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Comando cURL (Para testar no seu terminal)
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(curlCommand, 'curl')}
                className="text-xs px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar cURL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto">
              <code>{curlCommand}</code>
            </pre>
          </div>

          {/* Field Explanation Table */}
          <div className="pt-2 border-t border-stone-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Estrutura dos Campos Enviados
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800">
                <p className="font-mono text-rose-400 font-semibold">lead</p>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Primeiro nome, WhatsApp, e-mail e opt-in para dicas no WhatsApp.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800">
                <p className="font-mono text-rose-400 font-semibold">quizAnswers</p>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  As 5 perguntas sobre frizz, curvatura, químicas e hábitos respondidas.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/60 border border-stone-800">
                <p className="font-mono text-rose-400 font-semibold">diagnostic</p>
                <p className="text-stone-400 text-[11px] mt-0.5">
                  Nível de frizz calculado, causas e ajustes imediatos recomendados.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
