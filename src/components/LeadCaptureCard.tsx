import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, User, CheckSquare, Square, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import { LeadFormData } from '../types';

interface LeadCaptureCardProps {
  onSubmit: (data: LeadFormData) => void;
  onOpenInspector: () => void;
  onOpenGuide: () => void;
}

export function LeadCaptureCard({ onSubmit, onOpenInspector, onOpenGuide }: LeadCaptureCardProps) {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [optInWhatsApp, setOptInWhatsApp] = useState(true);
  const [errors, setErrors] = useState<{ nome?: string; whatsapp?: string; email?: string }>({});

  const formatWhatsapp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits.length > 0 ? `(${digits}` : '';
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value);
    setWhatsapp(formatted);
    if (errors.whatsapp) {
      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { nome?: string; whatsapp?: string; email?: string } = {};

    if (!nome.trim() || nome.trim().length < 2) {
      newErrors.nome = 'Por favor, informe seu primeiro nome.';
    }

    const phoneDigits = whatsapp.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.whatsapp = 'Insira um WhatsApp válido com DDD.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Insira um e-mail válido para receber o guia.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        nome: nome.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim().toLowerCase(),
        optInWhatsApp,
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#eee4e0] shadow-sm relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3f0] text-[#5b2333] text-[11px] font-semibold mb-3 border border-[#ebdcd8]">
            <Gift className="w-3.5 h-3.5 text-[#b86b7a]" />
            <span>Última Etapa</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
            Seu presente está quase liberado! 🎁
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
            Você respondeu ao quiz! Informe seus contatos para liberar o diagnóstico e o download do guia:
          </p>
        </div>

        {/* Minimalist Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Seu primeiro nome *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                }}
                placeholder="Como podemos chamar você?"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 bg-[#fdfbf9] ${
                  errors.nome
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-[#ebdcd8] focus:border-[#5b2333] focus:ring-[#5b2333]/30 hover:border-stone-300'
                }`}
              />
            </div>
            {errors.nome && <p className="text-xs text-red-500 mt-1 font-medium">{errors.nome}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Seu WhatsApp *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={whatsapp}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
                maxLength={15}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 bg-[#fdfbf9] ${
                  errors.whatsapp
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-[#ebdcd8] focus:border-[#5b2333] focus:ring-[#5b2333]/30 hover:border-stone-300'
                }`}
              />
            </div>
            {errors.whatsapp && <p className="text-xs text-red-500 mt-1 font-medium">{errors.whatsapp}</p>}
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Seu melhor e-mail *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="mariana@exemplo.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 bg-[#fdfbf9] ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-[#ebdcd8] focus:border-[#5b2333] focus:ring-[#5b2333]/30 hover:border-stone-300'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Opt-in WhatsApp Checkbox */}
          <div
            onClick={() => setOptInWhatsApp(!optInWhatsApp)}
            className="flex items-start gap-2.5 pt-1 cursor-pointer select-none text-xs text-stone-600"
          >
            <div className="mt-0.5 shrink-0 text-[#5b2333]">
              {optInWhatsApp ? (
                <CheckSquare className="w-4 h-4 fill-[#5b2333] text-white" />
              ) : (
                <Square className="w-4 h-4 text-stone-300" />
              )}
            </div>
            <span className="leading-snug">
              Quero receber dicas, novidades e ofertas do <strong>Toque da Beleza</strong> pelo WhatsApp.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 py-4 px-6 rounded-2xl font-bold text-white bg-[#5b2333] hover:bg-[#4a1c29] transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer shadow-sm"
          >
            <span>Receber meu guia gratuito 🎁</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Privacy Note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>Seus dados estão protegidos. Nada de spam.</span>
          </div>
        </form>

        {/* Developer Toolbar */}
        <div className="mt-6 pt-4 border-t border-[#f4ede9] flex items-center justify-between text-xs text-stone-400">
          {/* <span>Área técnica:</span> */}
          <div className="flex gap-2">
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
              Guia Servidor Node
            </button> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
