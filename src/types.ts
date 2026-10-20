export interface LeadFormData {
  nome: string;
  whatsapp: string;
  email: string;
  optInWhatsApp: boolean;
}

export interface HairQuizOption {
  id: string;
  text: string;
  detail?: string;
  tag?: string;
}

export interface HairQuizQuestion {
  id: number;
  questionNumber: string;
  title: string;
  subtitle?: string;
  options: HairQuizOption[];
}

export interface QuizAnswer {
  questionId: number;
  questionText: string;
  optionId: string;
  answerText: string;
}

export interface HairDiagnostic {
  title: string;
  tagline: string;
  statusBadge: string;
  frizzLevel: 'Alto' | 'Moderado' | 'Leve';
  summary: string;
  customTips: string[];
  recommendedHabit: string;
}

export interface LeadPayload {
  lead: {
    nome: string;
    whatsapp: string;
    email: string;
    optInWhatsApp: boolean;
    submittedAt: string;
  };
  quizAnswers: Array<{
    questionId: number;
    question: string;
    optionId: string;
    answer: string;
  }>;
  diagnostic: HairDiagnostic;
  metadata: {
    source: string;
    campaign: string;
    origin: string;
    userAgent: string;
    timestamp: number;
  };
}
