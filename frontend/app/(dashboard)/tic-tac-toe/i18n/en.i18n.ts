const en = {
  lobby: {
    title: "Tic Tac Toe",
    subtitle: "Classic 3×3 duel — first to align three wins",
    findMatch: "Find a match",
    connecting: "Connecting to game server…",
  },

  searching: {
    title: "Finding a match",
    subtitle: "Scanning for available players",
    cancel: "Cancel",
    stages: {
      server: "Connecting to server",
      scanning: "Scanning for players",
      joining: "Joining match room",
      starting: "Starting game",
    },
    stageBadge: {
      pending: "Pending",
      scanning: "Scanning…",
      connected: "Connected",
      joined: "Joined",
      ready: "Ready!",
    },
  },

  players: {
    you: "You",
    player1: "Player 1",
    player2: "Player 2",
    opponent: "Opponent",
    waitingForOpponent: "Waiting for opponent…",
    vs: "VS",
  },

  turn: {
    yourTurn: "Your turn — make your move",
    // use {{name}} as placeholder
    waiting: "Waiting for {{name}}…",
  },

  end: {
    win: {
      icon: "🏆",
      title: "Victory!",
      description: "Spectacular play — you defeated your opponent.",
    },
    lose: {
      icon: "😞",
      title: "Defeat",
      description: "Good effort, but your opponent claimed victory this time.",
    },
    draw: {
      icon: "🤝",
      title: "It's a draw",
      description: "A hard-fought battle — perfectly even.",
    },
    opponentDisconnected: {
      icon: "🏆",
      title: "Opponent forfeited!",
      description: "Your opponent left the game. You win by default.",
    },
    playAgain: "Play again",
    lobby: "Lobby",
  },
};

type TicTacToeTranslations = typeof en;

export { en, type TicTacToeTranslations };
