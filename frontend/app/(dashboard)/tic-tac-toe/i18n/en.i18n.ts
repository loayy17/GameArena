const en = {
  lobby: {
    title: "Tic Tac Toe",
    subtitle: "Deploy strategic marks in a classic 3x3 duel",
    findMatch: "Find Match",
    connecting: "Connecting to Game Server...",
    tabs: {
      quick: "Quick Match",
      invite: "Invite Friend",
    },
    searchFriends: "Search friends...",
    noFriendsFound: "No friends found",
    searchingTitle: "Searching for opponent...",
    searchingSubtitle: "Checking GameArena servers",
    cancelSearch: "Cancel Search",
    waitingForOpponent: "Waiting for opponent to accept invite or join...",
    cancelMatch: "Cancel Match",
    opponentFound: "OPPONENT FOUND!",
    startGame: "Start Game",
    waitingForStart: "Waiting for opponent to start...",
  },

  end: {
    playAgain: "Play again",
    lobby: "Lobby",
  },

  game: {
    you: "You",
    opponent: "Opponent",
    waiting: "Waiting...",
    player1: "Player 1",
    player2: "Player 2",
    opponentForfeited: "Opponent Forfeited!",
    opponentForfeitedDesc: "Your opponent left the game. You win by default!",
    victory: "VICTORY! 🎉",
    victoryDesc: "Spectacular play! You defeated your opponent.",
    draw: "IT'S A DRAW! 🤝",
    drawDesc: "A hard-fought battle! It's a tie.",
    defeat: "DEFEAT! 😢",
    defeatDesc: "Good effort, but opponent claimed victory this time.",
    yourTurn: "Your Turn - Make your move!",
    waitingFor: "Waiting for {name}...",
  },
};

type TicTacToeTranslations = typeof en;

export { en, type TicTacToeTranslations };
