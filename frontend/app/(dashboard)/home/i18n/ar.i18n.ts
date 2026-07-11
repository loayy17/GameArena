const ar = {
  welcome: (name: string) => "مرحبًا بعودتك" + (name ? `، ${name}` : ""),
  brand: "Arena404",
  enterArena: "ادخل الساحة. اختر معركتك.",
  playNow: "العب الآن",
  stats: {
    gamesAvailable: "الألعاب المتاحة",
    unreadMessages: "الرسائل غير المقروءة",
    friendRequests: "طلبات الصداقة",
  },
  games: {
    snake: "السمكة",
    snakeDesc: "كلاسيكية الأركادية - تأكل وتنتفس",
    ticTacToe: "لعبة المربعات والأشرطة",
    ticTacToeDesc: "دورية 3×3",
    pong: "بونغ",
    pongDesc: "تنس قديم",
  },
  recentHistory: {
    title: "آخر المعارك",
    viewAll: "عرض الكل",
    emptyTitle: "لا توجد معارك بعد",
    emptyDescription: "العب مباراتك الأولى وسيظهر سجلك هنا.",
  },
};

export { ar };
