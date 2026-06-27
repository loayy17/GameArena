import { TicTacToeTranslations } from "./en.i18n";

const ar: TicTacToeTranslations = {
  lobby: {
    title: "إكس أو",
    subtitle: "لعبة الشبكة الكلاسيكية 3×3 — الأول بثلاثة يفوز",
    findMatch: "ابحث عن خصم",
    connecting: "جارٍ الاتصال بخادم اللعبة…",
  },

  searching: {
    title: "البحث عن خصم",
    subtitle: "جارٍ فحص اللاعبين المتاحين",
    cancel: "إلغاء",
    stages: {
      server: "الاتصال بالخادم",
      scanning: "البحث عن لاعبين",
      joining: "الانضمام إلى الغرفة",
      starting: "بدء اللعبة",
    },
    stageBadge: {
      pending: "انتظار",
      scanning: "جارٍ الفحص…",
      connected: "متصل",
      joined: "انضممت",
      ready: "جاهز!",
    },
  },

  players: {
    you: "أنت",
    player1: "اللاعب 1",
    player2: "اللاعب 2",
    opponent: "الخصم",
    waitingForOpponent: "في انتظار الخصم…",
    vs: "ضد",
  },

  turn: {
    yourTurn: "دورك — اختر خطوتك",
    waiting: "في انتظار {{name}}…",
  },

  end: {
    win: {
      icon: "🏆",
      title: "فزت!",
      description: "أداء رائع — لقد تفوقت على خصمك.",
    },
    lose: {
      icon: "😞",
      title: "خسرت",
      description: "جهد جيد، لكن خصمك حقق الفوز هذه المرة.",
    },
    draw: {
      icon: "🤝",
      title: "تعادل",
      description: "مباراة شرسة — متكافئة تمامًا.",
    },
    opponentDisconnected: {
      icon: "🏆",
      title: "الخصم انسحب!",
      description: "غادر خصمك اللعبة. فزت بشكل تلقائي.",
    },
    playAgain: "العب مجدداً",
    lobby: "القائمة الرئيسية",
  },
};

export { ar };
