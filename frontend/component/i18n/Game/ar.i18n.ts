const ar = {
tictactoe: {
    name: "تيك تاك تو",
    description: "نشر علامات استراتيجية في مبارزة كلاسيكية 3×3",
    instruction: "تناوبا على وضع X أو O. احصل على ثلاثة في صف واحد للفوز."
  },
  snake: {
    name: "الأفعى",
    description: "اجعل ثعبانك ينمو وسيطر على الساحة",
    arrowKeysHint: "استخدم مفاتيح الأسهم للتحكم",
    instruction: "تحكم بمفاتيح الأسهم أو بالسحب لأكل الطعام والنمو. تجنب الحواف وثعبان الخصم."
  },
  pingpong: {
    name: "بينج بونج",
    description: "مواجهة المضرب الكلاسيكية في الوقت الفعلي",
    controlHint: "استخدم W/S أو مفاتيح الأسهم تحريك المضرب",
    instruction: "حرّك مضربك بـ W/S أو الأسهم (أو بالسحب على اللمس). أول من يصل إلى 5 نقاط يفوز."
  },
  rockpaperscissors: {
    name: "حجر ورقة مقص",
    description: "لعبة اليد الكلاسيكية - اختر حجرًا أو ورقةً أو مقصًا",
    instruction: "اختر حجرًا أو ورقةً أو مقصًا في كل جولة. الحجر يكسر المقص، والمقص يقطع الورقة، والورقة تغلف الحجر.",
    rock: "حجر",
    paper: "ورقة",
    scissors: "مقص"
  },
  connectfour: {
    name: "اتصل بأربعة",
    description: "أسقط الأقراص واربط أربعة في صف للفوز",
    instruction: "أسقط قرصًا في عمود عند دورك. اربط أربعة في صف واحد للفوز."
  },
  lobby: {
    searchingTitle: "البحث عن خصم...",
    quick: "سريع",
    invite: "دعوة",
    searchError: "تعذر العثور على مباراة. حاول مرة أخرى.",
    createLobbyError: "تعذر إنشاء اللوبي. حاول مرة أخرى."
  },
  waiting: {
    subtitle: "في انتظار قبول الخصم للدعوة أو الانضمام...",
    startVsAI: "ابدأ اللعبة (ضد الذكاء الاصطناعي)",
    inviteFriend: "دعوة صديق",
    cancelMatch: "إلغاء المباراة"
  },
  ready: {
    title: "تم العثور على الخصم!",
    startGame: "ابدأ اللعبة",
    waitingForStart: "في انتظار المضيف للبدء..."
  },
  game: {
    you: "أنت",
    youSuffix: "(أنت)",
    aiBot: "الذكاء الاصطناعي",
    turn: "الدور",
    vs: "ضد",
    opponent: "الخصم",
    waiting: "انتظار...",
    player1: "اللاعب 1",
    player2: "اللاعب 2",
    yourTurn: "دورك - قم بحركتك!",
    waitingFor: "في انتظار {name}...",
    leaveGame: "مغادرة اللعبة",
    firstTo: "الأول إلى {score}"
  },
  invite: {
    title: "دعوة صديق",
    cancel: "إلغاء",
    searchFriends: "ابحث عن الأصدقاء...",
    noFriends: "لم يتم العثور على أصدقاء"
  },
  result: {
    winShort: "فوز",
    loseShort: "خسارة",
    drawShort: "تعادل",
    playAgain: "العب مرة أخرى",
    backToLobby: "العودة إلى اللوبي",
    waiting: "انتظار...",
    accept: "قبول",
    reject: "رفض",
    playAgainRequest: "يريد اللعب مرة أخرى!"
  }
}
;

export { ar };
