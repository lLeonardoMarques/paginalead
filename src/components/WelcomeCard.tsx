import { motion } from 'motion/react';
import { ArrowRight, Sparkles, BookOpen, Clock, Heart, CheckCircle2 } from 'lucide-react';
import { PDF_ASSET_PATH } from '../data/quizData';

interface WelcomeCardProps {
  onStart: () => void;
  onOpenInspector: () => void;
  onOpenGuide: () => void;
}

export function WelcomeCard({ onStart, onOpenInspector, onOpenGuide }: WelcomeCardProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-9 border border-[#eee4e0] shadow-sm relative overflow-hidden text-center"
      >
        {/* Minimalist Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf3ef] text-[#6b2d41] text-[11px] font-semibold tracking-wide uppercase mb-4 border border-[#ebdcd8]">
          <Sparkles className="w-3 h-3 text-[#b86b7a]" />
          <span>Toque da Beleza • Salão de Estética</span>
        </div>

        {/* Welcome Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight font-serif leading-tight">
          Seu cabelo merece mais cuidado.
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 mt-3 max-w-md mx-auto leading-relaxed">
          Descubra em um questionário rápido de <strong>5 perguntas</strong> quais hábitos podem estar aumentando o frizz dos seus fios e receba gratuitamente nosso guia oficial de cuidados.
        </p>

        {/* Minimalist Book Teaser Badge */}
        <div className="my-6 p-4 rounded-2xl bg-[#faf5f2] border border-[#eee4e0] flex items-center gap-3.5 text-left max-w-md mx-auto">
          <div className="w-12 h-16 rounded-lg bg-[#5b2333] text-white flex flex-col justify-between p-2 shrink-0 shadow-sm">
            <span className="text-[8px] font-bold tracking-widest text-[#f5e6dc] uppercase">E-BOOK</span>
            <BookOpen className="w-4 h-4 text-[#f5e6dc]" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#944458]">Presente Gratuito</span>
            <p className="text-xs sm:text-sm font-bold text-stone-900 leading-snug truncate">
              7 erros que aumentam o frizz
            </p>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
              Dicas simples para fios mais alinhados e sedosos no dia a dia.
            </p>
          </div>
        </div>

        {/* 3 Step Visual Indicators - Minimal & Clean */}
        <div className="grid grid-cols-3 gap-2.5 my-6 text-left border-y border-[#f2e9e4] py-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#6b2d41] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#f5e6dc] text-[#6b2d41] text-[10px] font-bold flex items-center justify-center">1</span>
              <span>Quiz</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-tight">5 perguntas simples e rápidas.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#6b2d41] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#f5e6dc] text-[#6b2d41] text-[10px] font-bold flex items-center justify-center">2</span>
              <span>Diagnóstico</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-tight">Entenda a causa do arrepiado.</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#6b2d41] flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-[#f5e6dc] text-[#6b2d41] text-[10px] font-bold flex items-center justify-center">3</span>
              <span>PDF Grátis</span>
            </span>
            <p className="text-[11px] text-stone-500 leading-tight">Download direto no seu celular.</p>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-[#5b2333] hover:bg-[#4a1c29] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer shadow-sm"
        >
          <span>QUERO MEU GUIA GRATUITO 🎁</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Trust markers */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 mt-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Leva 1 minuto</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Gratuito</span>
          </span>
        </div>

        {/* Subtle Developer Toolbar */}
        <div className="mt-6 pt-4 border-t border-[#f4ede9] flex items-center justify-between text-xs text-stone-400">
          {/* <span>Área técnica do servidor:</span> */}
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={onOpenInspector}
              className="text-stone-500 hover:text-[#5b2333] underline cursor-pointer"
            >
              Inspecionar JSON
            </button> */}
            <span>·</span>
            {/* <button
              type="button"
              onClick={onOpenGuide}
              className="text-stone-500 hover:text-[#5b2333] underline cursor-pointer"
            >
              Guia Node + Mongo
            </button> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
