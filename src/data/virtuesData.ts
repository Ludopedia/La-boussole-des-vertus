import { VirtueDefinition, WorkshopSession } from '../types/workshop';

export const VIRTUES_DATA: Record<string, VirtueDefinition> = {
  prudence: {
    key: 'prudence',
    frenchTitle: 'La Prudence',
    subTitle: 'Sagesse pratique & Discernement',
    latinName: 'Prudentia',
    greekName: 'Phronēsis (Φρόνησις)',
    cardinalRole: 'Le Cocher des vertus (Auriga virtutum) - Guide les trois autres vertus vers leur juste mesure',
    essence:
      "La capacité de discernement lucide. L'intelligence pratique qui permet d'analyser une situation avec clarté, de peser le pour et le contre, d'anticiper les conséquences à long terme et de choisir les moyens justes pour atteindre un but noble. L'être prudent sait écouter, suspendre son jugement impulsif et demander conseil.",
    falseFriends:
      "Attention aux faux-amis : au sens philosophique, la prudence n'est ni la peur, ni la pusillanimité, ni l'hésitation craintive face à l'action. C'est au contraire l'œil de l'esprit qui éclaire la route.",
    antiqueQuote: {
      text: "La prudence est la source de toutes les autres vertus ; elle nous enseigne qu'on ne peut vivre heureux sans être sage, honnête et juste.",
      author: 'Épicure',
      work: 'Lettre à Ménécée',
    },
    color: {
      primary: '#B45309', // amber-700
      bg: '#FEF3C7', // amber-100
      border: '#F59E0B',
      text: '#92400E',
      light: '#FFFBEB',
    },
    questions: [
      {
        id: 'p1',
        text: "Face à un problème important ou un conflit, je prends le temps de la réflexion et j'analyse la situation à froid avant de parler ou d'agir.",
        subtext: "Discernement & suspension de l'impulsivité",
      },
      {
        id: 'p2',
        text: "Je sais reconnaître quand je ne sais pas quelque chose, et je demande volontiers conseil à des personnes plus compétentes.",
        subtext: "Humilité socratique & recherche d'avis éclairés",
      },
      {
        id: 'p3',
        text: "Je tire de vraies leçons de mes erreurs passées et j'évite de retomber dans les mêmes pièges.",
        subtext: "Mémoire réflexive & apprentissage continu",
      },
      {
        id: 'p4',
        text: "Dans mes choix quotidiens, j'arrive à voir au-delà du plaisir immédiat en anticipant les conséquences à long terme.",
        subtext: "Vision temporelle & arbitrage lucide",
      },
    ],
  },
  temperance: {
    key: 'temperance',
    frenchTitle: 'La Tempérance',
    subTitle: 'Maîtrise de soi & Modération',
    latinName: 'Temperantia',
    greekName: 'Sōphrosynē (Σωφροσύνη)',
    cardinalRole: "L'Harmonie intérieure - Préserve l'esprit de l'esclavage des passions démesurées",
    essence:
      "La vertu de l'équilibre, de la sobriété et de la liberté intérieure. Elle ne consiste nullement à s'interdire toute joie ou plaisir, mais à ne pas être esclave de ses appétits, pulsions ou affects (colère, nourriture, écrans, achats compulsifs, besoin d'avoir raison). La personne tempérante sait dire « assez » en toute sérénité.",
    falseFriends:
      "La tempérance n'est ni l'austérité triste ni la répression morbide des émotions. C'est la saine souveraineté de l'esprit qui jouit sans s'asservir.",
    antiqueQuote: {
      text: "Nul homme n'est libre s'il ne sait pas se maîtriser lui-même.",
      author: 'Pythagore',
      work: 'Sentences',
    },
    color: {
      primary: '#0F766E', // teal-700
      bg: '#CCFBF1', // teal-100
      border: '#14B8A6',
      text: '#115E59',
      light: '#F0FDFA',
    },
    questions: [
      {
        id: 't1',
        text: "Je sais m'arrêter à temps dans mes plaisirs (nourriture, boisson, écrans, réseaux sociaux, achats...) sans tomber dans l'excès.",
        subtext: 'Sobriété choisie & seuil de satiété',
      },
      {
        id: 't2',
        text: "Lorsqu'on me provoque ou que je suis frustré(e), j'arrive à garder mon calme et à maîtriser ma colère ou mon impatience.",
        subtext: 'Maîtrise affective & sang-froid',
      },
      {
        id: 't3',
        text: "Dans une discussion, je sais maîtriser mon ego : je n'ai pas besoin de monopoliser la parole ou d'avoir absolument le dernier mot.",
        subtext: "Humilité dans l'échange & écoute généreuse",
      },
      {
        id: 't4',
        text: "Mon humeur reste globalement stable ; je ne laisse pas une petite contrariété gâcher toute ma journée et celle des autres.",
        subtext: 'Équanimité stoïcienne & rayonnement serein',
      },
    ],
  },
  fortitude: {
    key: 'fortitude',
    frenchTitle: "La Force d'Âme",
    subTitle: 'Courage & Persévérance',
    latinName: 'Fortitudo',
    greekName: 'Andreia (Ἀνδρεία)',
    cardinalRole: "Le Bouclier moral - Soutient la volonté dans l'effort, le danger et la durée",
    essence:
      "Le courage n'est pas l'absence d'appréhension ou d'anxiété, mais la résolution d'agir malgré la peur pour une cause juste. Elle s'incarne sous deux formes complémentaires : l'Audace (oser entreprendre, porter une parole vraie, briser le conformisme) et l'Endurance (tenir bon dans l'adversité, faire preuve de résilience, honorer ses devoirs sur la durée).",
    falseFriends:
      "La force d'âme n'est ni la témérité aveugle ni l'agressivité bravache. Elle est fermeté tranquille et fidélité tenace face aux épreuves.",
    antiqueQuote: {
      text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.",
      author: 'Sénèque',
      work: 'Lettres à Lucilius',
    },
    color: {
      primary: '#B91C1C', // red-700
      bg: '#FEE2E2', // red-100
      border: '#EF4444',
      text: '#991B1B',
      light: '#FEF2F2',
    },
    questions: [
      {
        id: 'f1',
        text: "Je n'ai pas peur de défendre mes convictions ou de dire une vérité difficile, même si cela risque de déplaire au groupe.",
        subtext: 'Courage civique & authenticité',
      },
      {
        id: 'f2',
        text: "Quand je commence un projet difficile ou fastidieux, je vais jusqu'au bout sans me décourager au premier obstacle.",
        subtext: "Persévérance & rigueur d'accomplissement",
      },
      {
        id: 'f3',
        text: "Face aux coups durs de la vie ou au stress, je fais preuve de résilience sans me plaindre constamment.",
        subtext: "Résilience stoïque & tenue d'esprit",
      },
      {
        id: 'f4',
        text: "J'ose sortir de ma zone de confort (prendre des initiatives, affronter mes peurs, aborder des sujets délicats).",
        subtext: "Audace d'exploration & dépassement de soi",
      },
    ],
  },
  justice: {
    key: 'justice',
    frenchTitle: 'La Justice',
    subTitle: 'Équité & Loyauté',
    latinName: 'Justitia',
    greekName: 'Dikaiosynē (Δικαιοσύνη)',
    cardinalRole: 'Le Ciment de la Cité - Règle les relations mutuelles dans le respect du bien commun',
    essence:
      "La vertu relationnelle par excellence. Elle consiste selon la formule romaine à « rendre à chacun le sien » (*suum cuique tribuere*). Être juste, c'est être loyal, intègre, sincère, tenir ses engagements coûte que coûte, refuser le favoritisme arbitraire et veiller à ce que personne ne soit lésé ou calomnié.",
    falseFriends:
      "La justice philosophique ne se réduit pas à la simple conformité légale ou au juridisme tatillon. C'est une disposition du cœur à l'équité fraternelle.",
    antiqueQuote: {
      text: "La justice est la constante et perpétuelle volonté d'attribuer à chacun ce qui lui revient de droit.",
      author: 'Ulpien',
      work: 'Digeste',
    },
    color: {
      primary: '#4338CA', // indigo-700
      bg: '#E0E7FF', // indigo-100
      border: '#6366F1',
      text: '#3730A3',
      light: '#EEF2FF',
    },
    questions: [
      {
        id: 'j1',
        text: "Je suis une personne de parole : quand je prends un engagement envers un ami ou un collègue, je le tiens quoi qu'il en coûte.",
        subtext: 'Fidélité au serment & fiabilité sans faille',
      },
      {
        id: 'j2',
        text: "Dans un travail d'équipe ou une tâche commune, je prends équitablement ma part du fardeau sans me reposer sur les autres.",
        subtext: 'Partage loyal de la charge & équité collaborative',
      },
      {
        id: 'j3',
        text: "Je refuse de médire dans le dos des absents et je prends la défense de ceux qui sont critiqués injustement.",
        subtext: 'Défense des vulnérables & probité morale',
      },
      {
        id: 'j4',
        text: "Je sais reconnaître sincèrement le mérite des autres, les féliciter et exprimer ma gratitude sans jalousie.",
        subtext: 'Hommage au mérite & bienveillance sincère',
      },
    ],
  },
};

export const INITIAL_DEMO_SESSION: WorkshopSession = {
  id: 'session-demo',
  title: 'Atelier Philosophique des Quatre Vertus',
  date: '2026-10-23',
  currentStep: 0,
  activeParticipantId: 'part-1',
  participants: [
    {
      id: 'part-1',
      name: 'Alexandre',
      avatarColor: '#B45309',
      selfScores: {
        prudence: { q1: 4, q2: 4, q3: 3, q4: 4 }, // total 15
        temperance: { q1: 3, q2: 2, q3: 4, q4: 3 }, // total 12
        fortitude: { q1: 4, q2: 5, q3: 4, q4: 4 }, // total 17
        justice: { q1: 5, q2: 4, q3: 4, q4: 4 }, // total 17
      },
      peerReviews: {
        'part-2': {
          scores: { prudence: 16, temperance: 15, fortitude: 18, justice: 19 },
          anecdote: 'Camille a toujours une écoute attentive et n’a jamais rompu une promesse.',
        },
        'part-3': {
          scores: { prudence: 14, temperance: 11, fortitude: 19, justice: 16 },
          anecdote: 'Thomas est un roc dans les tempêtes et ne recule devant rien.',
        },
        'part-4': {
          scores: { prudence: 17, temperance: 14, fortitude: 16, justice: 18 },
          anecdote: 'Éléonore nous guide toujours vers la modération et la clarté intellectuelle.',
        },
      },
      commitment: {
        virtue: 'temperance',
        action: 'Mieux gérer mon impatience dans les débats passionnés et ralentir le rythme avant de répondre.',
      },
    },
    {
      id: 'part-2',
      name: 'Camille',
      avatarColor: '#0F766E',
      selfScores: {
        prudence: { q1: 4, q2: 5, q3: 4, q4: 4 }, // 17
        temperance: { q1: 4, q2: 4, q3: 4, q4: 3 }, // 15
        fortitude: { q1: 3, q2: 3, q3: 3, q4: 3 }, // 12
        justice: { q1: 5, q2: 5, q3: 5, q4: 4 }, // 19
      },
      peerReviews: {
        'part-1': {
          scores: { prudence: 16, temperance: 11, fortitude: 18, justice: 17 },
          anecdote: "Alexandre a une énergie formidable mais s'emporte vite quand on le contredit.",
        },
        'part-3': {
          scores: { prudence: 13, temperance: 13, fortitude: 17, justice: 15 },
          anecdote: 'Thomas ne lâche jamais ses amis.',
        },
        'part-4': {
          scores: { prudence: 18, temperance: 16, fortitude: 14, justice: 17 },
          anecdote: 'Éléonore réfléchit toujours avec beaucoup de recul.',
        },
      },
      commitment: {
        virtue: 'fortitude',
        action: 'Oser dire mon désaccord plus nettement en réunion sans craindre de déplaire.',
      },
    },
    {
      id: 'part-3',
      name: 'Thomas',
      avatarColor: '#B91C1C',
      selfScores: {
        prudence: { q1: 3, q2: 3, q3: 3, q4: 3 }, // 12
        temperance: { q1: 3, q2: 3, q3: 2, q4: 3 }, // 11
        fortitude: { q1: 5, q2: 5, q3: 4, q4: 5 }, // 19
        justice: { q1: 4, q2: 4, q3: 4, q4: 4 }, // 16
      },
      peerReviews: {
        'part-1': {
          scores: { prudence: 15, temperance: 12, fortitude: 18, justice: 16 },
          anecdote: 'Alexandre est toujours là quand il faut donner un coup de main.',
        },
        'part-2': {
          scores: { prudence: 18, temperance: 17, fortitude: 15, justice: 19 },
          anecdote: 'Camille est le repère moral du groupe.',
        },
        'part-4': {
          scores: { prudence: 17, temperance: 15, fortitude: 15, justice: 17 },
          anecdote: 'Éléonore nous apaise par sa sagesse.',
        },
      },
      commitment: {
        virtue: 'prudence',
        action: 'Prendre 24h avant de valider une grosse décision impulsive.',
      },
    },
    {
      id: 'part-4',
      name: 'Éléonore',
      avatarColor: '#4338CA',
      selfScores: {
        prudence: { q1: 5, q2: 4, q3: 4, q4: 5 }, // 18
        temperance: { q1: 4, q2: 4, q3: 4, q4: 4 }, // 16
        fortitude: { q1: 3, q2: 4, q3: 3, q4: 4 }, // 14
        justice: { q1: 4, q2: 4, q3: 5, q4: 5 }, // 18
      },
      peerReviews: {
        'part-1': {
          scores: { prudence: 14, temperance: 13, fortitude: 17, justice: 18 },
          anecdote: 'Un ami d’une loyauté exemplaire.',
        },
        'part-2': {
          scores: { prudence: 17, temperance: 16, fortitude: 16, justice: 18 },
          anecdote: 'Très juste et attentive aux personnes discrètes.',
        },
        'part-3': {
          scores: { prudence: 13, temperance: 12, fortitude: 18, justice: 16 },
          anecdote: 'Une force de travail et un courage stimulants.',
        },
      },
      commitment: {
        virtue: 'fortitude',
        action: 'Me lancer dans le projet d’écriture sans attendre des conditions parfaites.',
      },
    },
  ],
};

export const DEFAULT_BLANK_SESSION: WorkshopSession = {
  id: 'session-live',
  title: 'La Boussole des Vertus',
  date: new Date().toISOString().split('T')[0],
  currentStep: 0,
  activeParticipantId: 'user-1',
  participants: [
    {
      id: 'user-1',
      name: 'Moi',
      avatarColor: '#B45309',
      selfScores: {
        prudence: { q1: 4, q2: 4, q3: 4, q4: 4 },
        temperance: { q1: 3, q2: 3, q3: 3, q4: 3 },
        fortitude: { q1: 4, q2: 4, q3: 3, q4: 4 },
        justice: { q1: 4, q2: 4, q3: 4, q4: 4 },
      },
      peerReviews: {},
    },
    {
      id: 'friend-1',
      name: 'Ami 1',
      avatarColor: '#0F766E',
      selfScores: {
        prudence: { q1: 3, q2: 4, q3: 3, q4: 4 },
        temperance: { q1: 4, q2: 3, q3: 4, q4: 4 },
        fortitude: { q1: 4, q2: 3, q3: 4, q4: 3 },
        justice: { q1: 4, q2: 4, q3: 4, q4: 4 },
      },
      peerReviews: {},
    },
  ],
};
