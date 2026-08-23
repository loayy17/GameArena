const ar = {
  welcome: (name: string) => `مرحباً بعودتك${name ? `، ${name}` : ""}`,
  welcomeDesc: "اختر لعبة، ادعُ صديقاً وتسلّق المراتب.",
  playNow: "العب الآن",
  record: {
    wins: "الانتصارات",
    losses: "الخسائر",
    draws: "التعادلات"
  },
  unreadMessages: "الرسائل غير المقروءة",
  friendRequests: "طلبات الصداقة",
  gamesTitle: "الألعاب",
  viewAllGames: "عرض الكل",
  recentHistory: {
    title: "المعارك الأخيرة",
    viewAll: "عرض الكل",
    emptyTitle: "لا توجد معارك بعد",
    emptyDescription: "العب مباراتك الأولى وسيظهر سجلك هنا."
  }
};

export { ar };
