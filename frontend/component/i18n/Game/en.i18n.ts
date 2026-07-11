const en = {
  tictactoe: {
    name: "Tic Tac Toe",
    description: "Deploy strategic marks in a classic 3x3 duel",
  },
  snake: {
    name: "Snake",
    description: "Grow your snake and dominate the arena",
    arrowKeysHint: "Use arrow keys to control",
  },
  pingpong: {
    name: "Ping Pong",
    description: "Classic paddle showdown in real-time",
  },

  lobby: {
    findMatch: "Find Match",
    connecting: "Connecting to Game Server...",
    searchingTitle: "Searching for opponent...",
    searchingSubtitle: "Checking GameArena servers",
    cancelSearch: "Cancel Search",
    quick: "Quick",
    invite: "Invite",
  },

  waiting: {
    title: "Waiting for Opponent",
    subtitle: "Waiting for opponent to accept invite or join...",
    startVsAI: "Start Game (vs AI)",
    inviteFriend: "Invite Friend",
    cancelMatch: "Cancel Match",
    searchFriends: "Search friends...",
    noFriendsFound: "No friends found",
  },

  ready: {
    title: "OPPONENT FOUND!",
    startGame: "Start Game",
    waitingForStart: "Waiting for host to start...",
  },

  game: {
    you: "You",
    youSuffix: "(You)",
    aiBot: "AI Bot",
    turn: "Turn",
    vs: "VS",
    opponent: "Opponent",
    waiting: "Waiting...",
    player1: "Player 1",
    player2: "Player 2",
    yourTurn: "Your Turn - Make your move!",
    waitingFor: "Waiting for {name}...",
    leaveGame: "Leave Game",
  },

  invite: {
    title: "Invite a Friend",
    cancel: "Cancel",
    searchFriends: "Search friends...",
    noFriends: "No friends found",
  },

  result: {
    opponentForfeited: "Opponent Forfeited!",
    opponentForfeitedDesc: "Your opponent left the game. You win by default!",
    victory: "VICTORY! 🎉",
    victoryDesc: "Spectacular play! You defeated your opponent.",
    draw: "IT'S A DRAW! 🤝",
    drawDesc: "A hard-fought battle! It's a tie.",
    defeat: "DEFEAT! 😢",
    defeatDesc: "Good effort, but opponent claimed victory this time.",
    playAgain: "Play Again",
    backToLobby: "Back to Lobby",
  },
};

type GameTranslations = typeof en;

export { en, type GameTranslations };
