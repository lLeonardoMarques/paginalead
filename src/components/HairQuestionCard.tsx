import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { HairQuizQuestion, HairQuizOption } from '../types';

interface HairQuestionCardProps {
  question: HairQuizQuestion;
  currentStepIndex: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (option: HairQuizOption) => void;
  onPrev: () => void;
  onOpenInspector: () => void;
  onOpenGuide: () => void;
}

export function HairQuestionCard({
  question,
  currentStepIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  onPrev,
  onOpenInspector,
  onOpenGuide,
}: HairQuestionCardProps) {
  const [clickedId, setClickedId] = useState<string | null>(null);

  const progressPercentage = Math.round((currentStepIndex / totalQuestions) * 100);

  const handleOptionClick = (option: HairQuizOption) => {
    setClickedId(option.id);
    setTimeout(() => {
      onSelectOption(option);
      setClickedId(null);
    }, 240);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 sm:py-6">
      {/* Top Minimalist Header */}
      <div className="flex items-center justify-between gap-2 mb-4 px-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-[#5b2333] transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {/* <button
            type="button"
            onClick={onOpenInspector}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            Inspecionar
          </button> */}
          <span className="text-stone-300">·</span>
          {/* <button
            type="button"
            onClick={onOpenGuide}
            className="text-stone-400 hover:text-stone-700 transition-colors"
          >
            Guia Node
          </button> */}
        </div>
      </div>

      {/* Main Animated Card - Minimalist */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eee4e0] shadow-sm relative overflow-hidden"
      >
        {/* Progress & Question Counter */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#5b2333] tracking-wide uppercase text-[11px]">
              {question.questionNumber}
            </span>
            <span className="text-stone-400 font-medium">
              {currentStepIndex} de {totalQuestions} respondidas
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#f5eae6] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#5b2333] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question Headline */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug font-serif">
            {question.title}
          </h2>
          {question.subtitle && (
            <p className="text-xs sm:text-sm text-stone-500 mt-2 leading-relaxed">
              {question.subtitle}
            </p>
          )}
        </div>

        {/* 4 Interactive Option Cards */}
        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id || clickedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#faf3f0] border-[#5b2333] shadow-xs'
                    : 'bg-[#fcfaf8] hover:bg-white border-[#ebdcd8] hover:border-[#b86b7a]'
                }`}
              >
                {/* Radio Circle Indicator */}
                <div className="mt-0.5 shrink-0">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#5b2333] flex items-center justify-center text-white">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-stone-300 bg-white" />
                  )}
                </div>

                {/* Option Text */}
                <div className="flex-1 pr-2">
                  <h3
                    className={`text-sm sm:text-base font-medium leading-snug ${
                      isSelected ? 'text-[#5b2333] font-semibold' : 'text-stone-800'
                    }`}
                  >
                    {option.text}
                  </h3>
                  {option.detail && (
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {option.detail}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
