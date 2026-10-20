import { HairQuizQuestion, HairDiagnostic, QuizAnswer } from '../types';

export const HAIR_QUIZ_QUESTIONS: HairQuizQuestion[] = [
  {
    id: 1,
    questionNumber: 'Pergunta 1 de 5',
    title: 'Como você descreveria seu cabelo atualmente?',
    subtitle: 'Selecione a opção que mais se aproxima do estado atual dos seus fios:',
    options: [
      {
        id: '1a',
        text: 'Ressecado e sem brilho',
        detail: 'Fios opacos, ásperos ao toque e precisando de hidratação e nutrição.',
      },
      {
        id: '1b',
        text: 'Com muito frizz e fios arrepiados',
        detail: 'Fios rebeldes no topo e ao redor do rosto, sensíveis à umidade do ar.',
      },
      {
        id: '1c',
        text: 'Quebradiço e com pontas danificadas',
        detail: 'Fios fragilizados, pontas duplas ou secas que se rompem ao pentear.',
      },
      {
        id: '1d',
        text: 'Saudável, mas quero cuidar melhor',
        detail: 'Fios em bom estado, buscando prevenção e alinhamento impecável.',
      },
    ],
  },
  {
    id: 2,
    questionNumber: 'Pergunta 2 de 5',
    title: 'Qual é o seu tipo de cabelo?',
    subtitle: 'A curvatura natural influencia diretamente na distribuição da oleosidade e no frizz:',
    options: [
      {
        id: '2a',
        text: 'Liso',
        detail: 'Sem curvatura natural, frizz costuma aparecer por atrito ou calor.',
      },
      {
        id: '2b',
        text: 'Ondulado',
        detail: 'Formato em S suave, tende a perder definição e arrepiar na umidade.',
      },
      {
        id: '2c',
        text: 'Cacheado',
        detail: 'Cachos definidos em espiral, exige retenção hídrica e selagem nutritiva.',
      },
      {
        id: '2d',
        text: 'Crespo',
        detail: 'Curvatura mais fechada ou em zigue-zague, estrutura mais delicada.',
      },
    ],
  },
  {
    id: 3,
    questionNumber: 'Pergunta 3 de 5',
    title: 'Você tem algum procedimento químico no cabelo?',
    subtitle: 'Químicas alteram a cutícula capilar e exigem cuidados térmicos e reposição lipídica:',
    options: [
      {
        id: '3a',
        text: 'Progressiva ou alisamento',
        detail: 'Fios selados quimicamente que necessitam de reposição de massa e maciez.',
      },
      {
        id: '3b',
        text: 'Coloração ou mechas',
        detail: 'Descoloração ou tinta que abrem as cutículas e causam porosidade.',
      },
      {
        id: '3c',
        text: 'Mais de um procedimento',
        detail: 'Combinação de químicas que pede cronograma de reconstrução e nutrição.',
      },
      {
        id: '3d',
        text: 'Não tenho química',
        detail: 'Cabelo 100% natural, focado em proteção térmica e hábitos diários.',
      },
    ],
  },
  {
    id: 4,
    questionNumber: 'Pergunta 4 de 5',
    title: 'Qual destes hábitos faz parte da sua rotina?',
    subtitle: 'Pequenos gestos diários são os maiores vilões do frizz silencioso:',
    options: [
      {
        id: '4a',
        text: 'Durmo com fronha comum, sem touca de cetim',
        detail: 'O atrito do algodão durante a noite resseca os fios e cria fios arrepiados.',
      },
      {
        id: '4b',
        text: 'Uso secador ou chapinha sem protetor térmico',
        detail: 'Calor direto evapora a água interna do fio e queima a cutícula.',
      },
      {
        id: '4c',
        text: 'Esfrego o cabelo com a toalha',
        detail: 'A fricção agressiva com toalha de banho causa quebra e arrepiados.',
      },
      {
        id: '4d',
        text: 'Já evito esses hábitos',
        detail: 'Parabéns! Você já tem consciência dos cuidados fundamentais.',
      },
    ],
  },
  {
    id: 5,
    questionNumber: 'Pergunta 5 de 5',
    title: 'O que você mais gostaria de melhorar no seu cabelo?',
    subtitle: 'Seu foco principal para o cronograma capilar que você receberá:',
    options: [
      {
        id: '5a',
        text: 'Reduzir o frizz',
        detail: 'Fios disciplinados, alinhados e sem arrepiados mesmo em dias úmidos.',
      },
      {
        id: '5b',
        text: 'Ter mais brilho e maciez',
        detail: 'Toque sedoso, cutículas bem seladas e reflexo luminoso natural.',
      },
      {
        id: '5c',
        text: 'Diminuir a quebra',
        detail: 'Fortalecer a fibra capilar, encorpar as pontas e evitar rompimentos.',
      },
      {
        id: '5d',
        text: 'Deixar os fios mais alinhados',
        detail: 'Caimento fluido, desembaraço fácil e efeito de salão no dia a dia.',
      },
    ],
  },
];

export function calculateHairDiagnostic(answers: QuizAnswer[]): HairDiagnostic {
  const q1 = answers.find((a) => a.questionId === 1)?.answerText || '';
  const q2 = answers.find((a) => a.questionId === 2)?.answerText || '';
  const q3 = answers.find((a) => a.questionId === 3)?.answerText || '';
  const q4 = answers.find((a) => a.questionId === 4)?.answerText || '';
  const q5 = answers.find((a) => a.questionId === 5)?.answerText || '';

  const hasChemical = q3.includes('Progressiva') || q3.includes('Coloração') || q3.includes('Mais de um');
  const hasAggressiveHabit = q4.includes('fronha') || q4.includes('protetor') || q4.includes('Esfrego');

  let frizzLevel: 'Alto' | 'Moderado' | 'Leve' = 'Moderado';
  if (q1.includes('frizz') || (hasChemical && hasAggressiveHabit)) {
    frizzLevel = 'Alto';
  } else if (q1.includes('Saudável') && !hasChemical) {
    frizzLevel = 'Leve';
  }

  const customTips: string[] = [];

  if (q4.includes('fronha')) {
    customTips.push('Adote a touca ou fronha de cetim: ela reduz em até 80% o atrito mecânico enquanto você dorme.');
  } else if (q4.includes('protetor')) {
    customTips.push('Protetor térmico obrigatório: nunca exponha o fio ao secador ou chapinha sem uma camada protetora.');
  } else if (q4.includes('Esfrego')) {
    customTips.push('Troque a toalha comum por camiseta de algodão ou toalha de microfibra, apenas pressionando os fios.');
  } else {
    customTips.push('Mantenha o uso diário de leave-in com ação anti-umidade nas pontas e comprimento.');
  }

  if (hasChemical) {
    customTips.push('Fios com química precisam de selagem lipídica: invista em nutrição semanal com óleos vegetais leves.');
  } else {
    customTips.push('Seus fios naturais respondem muito rápido a máscaras hidratantes e finalizadores com proteção solar.');
  }

  customTips.push('Desembarace sempre começando pelas pontas com condicionador ou leave-in, subindo com delicadeza.');

  return {
    title: `Diagnóstico: Cabelo ${q2 || 'Feminino'} com Frizz ${frizzLevel}`,
    tagline: `Foco principal: ${q5 || 'Redução de Frizz e Alinhamento'}`,
    statusBadge: `Frizz ${frizzLevel} • Curvatura ${q2 || 'Natural'}`,
    frizzLevel,
    summary: `Identificamos que a principal causa do arrepiado nos seus fios está ligada à ${
      hasChemical ? 'porosidade de procedimentos químicos combinada à umidade' : 'sensibilidade ao atrito diário e evaporação de hidratação'
    }. Com os ajustes certos do nosso Guia, você notará fios alinhados e sedosos já na primeira semana.`,
    customTips,
    recommendedHabit: q4.includes('fronha')
      ? 'Touca de cetim antes de dormir'
      : q4.includes('protetor')
      ? 'Protetor térmico em todas as secagens'
      : 'Secagem suave sem torcer com toalha de microfibra',
  };
}

export const PDF_ASSET_PATH = '/assets/aistudio/Guia_Premium_7_Erros_Frizz_Toque_da_Beleza_a287e171.pdf';
