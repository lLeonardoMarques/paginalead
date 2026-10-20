import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Terminal, BookOpen, Heart, RefreshCw, Scissors } from 'lucide-react';
import { LeadFormData, HairQuizOption, QuizAnswer, HairDiagnostic, LeadPayload } from './types';
import { HAIR_QUIZ_QUESTIONS, calculateHairDiagnostic } from './data/quizData';
import { WelcomeCard } from './components/WelcomeCard';
import { HairQuestionCard } from './components/HairQuestionCard';
import { LeadCaptureCard } from './components/LeadCaptureCard';
import { GiftThankYouCard } from './components/GiftThankYouCard';
import { PayloadInspectorModal } from './components/PayloadInspectorModal';
import { NodeServerGuideModal } from './components/NodeServerGuideModal';

export default function App() {
  // Step states: 'welcome' | 0 | 1 | 2 | 3 | 4 | 'capture' | 'thankyou'
  const [currentStep, setCurrentStep] = useState<'welcome' | number | 'capture' | 'thankyou'>('welcome');

  const [leadData, setLeadData] = useState<LeadFormData>({
    nome: '',
    whatsapp: '',
    email: '',
    optInWhatsApp: true,
  });

  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [serverEndpoint, setServerEndpoint] = useState<string>('https://server-lead.onrender.com/api/leads');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Compute calculated Diagnostic based on answers
  const computedDiagnostic: HairDiagnostic = useMemo(() => {
    return calculateHairDiagnostic(answers);
  }, [answers]);

  // Current payload for real-time inspector
  const currentPayload: LeadPayload = useMemo(() => {
    return {
      lead: {
        nome: leadData.nome || 'Visitante DemonstraÃ§Ã£o',
        whatsapp: leadData.whatsapp || '(11) 98765-4321',
        email: leadData.email || 'contato@exemplo.com',
        optInWhatsApp: leadData.optInWhatsApp,
        submittedAt: new Date().toISOString(),
      },
      quizAnswers: answers.length > 0
        ? answers.map((a) => ({
            questionId: a.questionId,
            question: a.questionText,
            optionId: a.optionId,
            answer: a.answerText,
          }))
        : [
            {
              questionId: 1,
              question: HAIR_QUIZ_QUESTIONS[0].title,
              optionId: '1b',
              answer: HAIR_QUIZ_QUESTIONS[0].options[1].text,
            },
          ],
      diagnostic: computedDiagnostic,
      metadata: {
        source: 'quiz-anti-frizz-toque-da-beleza',
        campaign: 'guia-7-erros-frizz',
        origin: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Browser',
        timestamp: Date.now(),
      },
    };
  }, [leadData, answers, computedDiagnostic]);

  const handleStartQuiz = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (option: HairQuizOption) => {
    if (typeof currentStep !== 'number') return;

    const currentQuestion = HAIR_QUIZ_QUESTIONS[currentStep];
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.title,
      optionId: option.id,
      answerText: option.text,
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex((a) => a.questionId === currentQuestion.id);
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    setAnswers(updatedAnswers);

    // If on last question, advance to lead capture step
    if (currentStep < HAIR_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep('capture');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevQuestion = () => {
    if (typeof currentStep === 'number') {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        setCurrentStep('welcome');
      }
    } else if (currentStep === 'capture') {
      setCurrentStep(HAIR_QUIZ_QUESTIONS.length - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeadCaptureSubmit = (data: LeadFormData) => {
    setLeadData(data);
    setCurrentStep('thankyou');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentStep('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf8] text-stone-800 antialiased font-sans">
      {/* Top Bar - Minimalist Brand Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#eee4e0] px-4 sm:px-6 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 text-left hover:opacity-85 transition cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#5b2333] text-[#f5e6dc] flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base text-[#5b2333] leading-none tracking-tight">
                Toque da Beleza
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block mt-0.5 font-medium">
                SalÃ£o de EstÃ©tica
              </span>
            </div>
          </button>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-[#ebdcd8] text-stone-600 hover:text-[#5b2333] bg-[#faf5f2] hover:bg-[#f5eae6] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Terminal className="w-3 h-3 text-[#b86b7a]" />
              <span>JSON</span>
            </button> */}
            {/* <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#5b2333] text-white hover:bg-[#4a1c29] transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3 h-3" />
              <span>Guia Node</span>
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {/* Welcome Screen - Soft and Inviting */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <WelcomeCard
                onStart={handleStartQuiz}
                onOpenInspector={() => setIsInspectorOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            </motion.div>
          )}

          {/* 5 Hair Frizz Questions */}
          {typeof currentStep === 'number' && (
            <motion.div
              key={`hair-question-${currentStep}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <HairQuestionCard
                question={HAIR_QUIZ_QUESTIONS[currentStep]}
                currentStepIndex={currentStep}
                totalQuestions={HAIR_QUIZ_QUESTIONS.length}
                selectedOptionId={
                  answers.find((a) => a.questionId === HAIR_QUIZ_QUESTIONS[currentStep].id)?.optionId
                }
                onSelectOption={handleSelectOption}
                onPrev={handlePrevQuestion}
                onOpenInspector={() => setIsInspectorOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            </motion.div>
          )}

          {/* Lead Capture Step */}
          {currentStep === 'capture' && (
            <motion.div
              key="lead-capture-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
              className="w-full"
            >
              <LeadCaptureCard
                onSubmit={handleLeadCaptureSubmit}
                onOpenInspector={() => setIsInspectorOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
              />
            </motion.div>
          )}

          {/* Thank You & PDF Download Screen */}
          {currentStep === 'thankyou' && (
            <motion.div
              key="gift-thankyou-step"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <GiftThankYouCard
                leadData={leadData}
                answers={answers}
                diagnostic={computedDiagnostic}
                serverEndpoint={serverEndpoint}
                onOpenInspector={() => setIsInspectorOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Minimalist Footer */}
      <footer className="mt-auto border-t border-[#eee4e0] bg-white py-4 px-4 text-center">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Heart className="w-3.5 h-3.5 text-[#b86b7a] fill-[#b86b7a]" />
            <span>Toque da Beleza Salão de Estética</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400">
            <button
              type="button"
              onClick={() => setIsInspectorOpen(true)}
              className="hover:text-stone-700 transition-colors cursor-pointer"
            >
              
            </button>
            <span></span>
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-stone-700 transition-colors cursor-pointer"
            >
               
            </button>
            <span></span>
            <button
              type="button"
              onClick={handleRestart}
              className="hover:text-stone-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span></span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PayloadInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        payload={currentPayload}
        serverEndpoint={serverEndpoint}
        onUpdateEndpoint={(newEndpoint) => setServerEndpoint(newEndpoint)}
      />

      <NodeServerGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
