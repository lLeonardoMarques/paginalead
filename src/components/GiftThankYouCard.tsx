import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  BookOpen,
  CheckCircle,
  MessageCircle,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Code2,
  Check,
} from 'lucide-react';
import { LeadFormData, QuizAnswer, HairDiagnostic, LeadPayload } from '../types';
import { PDF_ASSET_PATH } from '../data/quizData';

interface GiftThankYouCardProps {
  leadData: LeadFormData;
  answers: QuizAnswer[];
  diagnostic: HairDiagnostic;
  serverEndpoint: string;
  onOpenInspector: () => void;
  onOpenGuide: () => void;
  onRestart: () => void;
}

export function GiftThankYouCard({
  leadData,
  answers,
  diagnostic,
  serverEndpoint,
  onOpenInspector,
  onOpenGuide,
  onRestart,
}: GiftThankYouCardProps) {
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'server_offline' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showReaderModal, setShowReaderModal] = useState(false);

  const leadPayload: LeadPayload = {
    lead: {
      nome: leadData.nome,
      whatsapp: leadData.whatsapp,
      email: leadData.email,
      optInWhatsApp: leadData.optInWhatsApp,
      submittedAt: new Date().toISOString(),
    },
    quizAnswers: answers.map((a) => ({
      questionId: a.questionId,
      question: a.questionText,
      optionId: a.optionId,
      answer: a.answerText,
    })),
    diagnostic,
    metadata: {
      source: 'quiz-anti-frizz-toque-da-beleza',
      campaign: 'guia-7-erros-frizz',
      origin: typeof window !== 'undefined' ? window.location.origin : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: Date.now(),
    },
  };

  const dispatchLead = async () => {
    setSendStatus('sending');
    setErrorMessage('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(serverEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setSendStatus('success');
      } else {
        const text = await response.text();
        setSendStatus('error');
        setErrorMessage(`Servidor retornou ${response.status}: ${text || 'Erro desconhecido'}`);
      }
    } catch (err: unknown) {
      setSendStatus('server_offline');
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Servidor ainda não iniciado na porta configurada.');
      }
    }
  };

  useEffect(() => {
    dispatchLead();
  }, [serverEndpoint]);

  const handleDownloadPdf = () => {
    setDownloadTriggered(true);
    const link = document.createElement('a');
    link.href = PDF_ASSET_PATH;
    link.download = 'Guia_7_Erros_Frizz_Toque_da_Beleza.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadTriggered(false), 4000);
  };

  const habitsChecklist = [
    { title: 'Dormir com touca ou fronha de cetim', desc: 'Evita a fricção noturna e previne o arrepiado matinal.' },
    { title: 'Secar sem esfregar ou torcer os fios', desc: 'Apenas pressione delicadamente com toalha de microfibra ou algodão.' },
    { title: 'Desembaraçar com delicadeza pelas pontas', desc: 'Use condicionador ou desembaraçante e nunca puxe com força.' },
    { title: 'Usar protetor térmico antes do calor', desc: 'Imprescindível antes do secador, difusor ou chapinha.' },
    { title: 'Lavar com água morna e aplicar condicionador', desc: 'Água muito quente retira a barreira lipídica protetora.' },
    { title: 'Aplicar leave-in na quantidade certa', desc: 'Concentrar no comprimento e pontas para selar as cutículas.' },
    { title: 'Observar o que funciona no seu tipo de fio', desc: 'Respeite a curvatura e a resposta individual do seu cabelo.' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-8 space-y-5">
      {/* Thank you celebratory title */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3f0] text-[#5b2333] text-[11px] font-semibold mb-2.5 border border-[#ebdcd8]">
          <Sparkles className="w-3.5 h-3.5 text-[#b86b7a]" />
          <span>Cadastro Concluído</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
          Seu presente está pronto! 🎁
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
          Preparamos um guia especial para ajudar você a reduzir o frizz com cuidados simples no dia a dia.
        </p>
      </motion.div>

      {/* Book Card Display - Clean & Minimalist */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="bg-white rounded-3xl p-5 sm:p-7 border border-[#eee4e0] shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Visual Book Cover Presentation */}
          <div className="relative w-36 sm:w-40 h-52 sm:h-56 rounded-2xl bg-[#5b2333] text-white p-4 shadow-sm border border-[#6b2d41] flex flex-col justify-between shrink-0 overflow-hidden">
            <div>
              <span className="text-[8px] font-bold tracking-widest uppercase text-[#f5e6dc] block opacity-90">
                TOQUE DA BELEZA
              </span>
              <span className="text-[8px] font-medium tracking-wider text-[#eee4e0] uppercase block mt-0.5">
                GUIA GRATUITO
              </span>
              <h3 className="text-sm sm:text-base font-bold leading-tight font-serif mt-3 text-white">
                7 erros que aumentam o frizz
              </h3>
            </div>

            <div className="pt-2 border-t border-white/20">
              <p className="text-[9px] text-[#f5e6dc] leading-tight line-clamp-3">
                E o que fazer para ter fios mais alinhados, macios e com menos arrepiados.
              </p>
            </div>
          </div>

          {/* Book Details and Action Buttons */}
          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#944458]">
              Guia Gratuito • Toque da Beleza
            </span>

            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-tight font-serif">
              7 erros que aumentam o frizz
            </h2>

            <p className="text-xs text-stone-600 leading-relaxed">
              Baixe seu guia e comece hoje mesmo a transformar a rotina dos seus cabelos.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-white bg-[#5b2333] hover:bg-[#4a1c29] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                {downloadTriggered ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Download Iniciado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Baixar meu guia em PDF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowReaderModal(true)}
                className="w-full py-2.5 px-4 rounded-xl font-medium text-[#5b2333] bg-[#faf5f2] hover:bg-[#f5eae6] border border-[#eee4e0] transition-colors flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Visualizar na Tela</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Checklist from the PDF */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        className="bg-white rounded-3xl p-5 sm:p-6 border border-[#eee4e0] shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between border-b border-[#f4ede9] pb-3">
          <h3 className="text-sm font-bold text-stone-900 font-serif">
            Checklist Rápido do Guia
          </h3>
          <span className="text-[11px] text-[#8a3f53] font-medium">7 Hábitos para Mudar</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {habitsChecklist.map((habit, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-[#fcfaf8] border border-[#ebdcd8] flex items-start gap-3 text-xs"
            >
              <span className="w-4 h-4 rounded-full bg-[#f5e6dc] text-[#5b2333] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-stone-900">{habit.title}</p>
                <p className="text-stone-500 text-[11px] mt-0.5">{habit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* WhatsApp Salon Direct Contact Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.35 }}
        className="bg-[#5b2333] rounded-3xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold font-serif">Seu cabelo merece um cuidado único</h4>
          <p className="text-xs text-[#ebdcd8] max-w-sm">
            Tire dúvidas com as especialistas do Toque da Beleza sobre o seu tipo de fio.
          </p>
        </div>

        <a
          href={`https://wa.me/5511999999999?text=${encodeURIComponent(
            `Olá, meu nome é ${leadData.nome}. Respondi ao quiz do frizz e gostaria de conversar com o Toque da Beleza!`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#f5e6dc] hover:bg-[#ebdcd8] text-[#5b2333] font-bold text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Converse com o Toque da Beleza</span>
        </a>
      </motion.div>

      {/* Developer Node.js Backend Status Strip */}
     

      {/* Restart link */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onRestart}
          className="text-xs text-stone-400 hover:text-[#5b2333] transition-colors underline cursor-pointer"
        >
          Voltar ao início do quiz
        </button>
      </div>

      {/* PDF Modal */}
      {showReaderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#eee4e0]">
            <div className="p-4 bg-[#5b2333] text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-serif">7 erros que aumentam o frizz</h3>
                <p className="text-[11px] text-[#f5e6dc]">Guia oficial Toque da Beleza</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={PDF_ASSET_PATH}
                  download="Guia_7_Erros_Frizz_Toque_da_Beleza.pdf"
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowReaderModal(false)}
                  className="p-1 rounded-lg text-white/80 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#fcfaf8]">
              <div className="aspect-[3/4] sm:aspect-auto sm:h-[65vh] w-full rounded-2xl overflow-hidden border border-[#eee4e0] bg-stone-100 shadow-inner">
                <iframe
                  src={PDF_ASSET_PATH}
                  title="Guia 7 Erros que Aumentam o Frizz - Toque da Beleza"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
