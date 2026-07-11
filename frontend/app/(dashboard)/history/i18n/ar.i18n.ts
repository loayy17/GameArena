import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

const ar = {
  title: "سجل المباريات",
  subtitle: "راجع مبارياتك السابقة، تتبّع انتصاراتك، وتعلّم من كل مواجهة.",
  badge: "سجل المعارك",
  versus: "ضد",
  filters: {
    all: "الكل",
    win: "انتصارات",
    loss: "خسائر",
    draw: "تعادل",
  },
  summary: {
    wins: "انتصارات",
    losses: "خسائر",
    draws: "تعادل",
  },
  results: {
    win: "فوز",
    loss: "خسارة",
    draw: "تعادل",
  },
  games: {
    [GamesKindEnum.Snake]: "الثعبان",
    [GamesKindEnum.TicTacToe]: "إكس أو",
    [GamesKindEnum.PingPong]: "بينغ بونغ",
    [GamesKindEnum.None]: "غير معروف",
  },
  empty: {
    title: "لا توجد مباريات بعد",
    description: "سيظهر سجل مبارياتك هنا بعد إنهاء أول لعبة.",
    filtered: "لا توجد مباريات لهذا الفلتر.",
  },
};

export { ar };
