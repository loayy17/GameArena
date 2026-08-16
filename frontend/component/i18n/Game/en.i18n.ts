const en = {
tictactoe: {
    name: "Tic Tac Toe",
    description: "Deploy strategic marks in a classic 3x3 duel",
    instruction: "Take turns placing X or O. Get three in a row to win."
  },
  snake: {
    name: "Snake",
    description: "Grow your snake and dominate the arena",
    arrowKeysHint: "Use arrow keys to control",
    instruction: "Steer with arrow keys or swipe to eat food and grow. Don't hit walls or your opponent."
  },
  pingpong: {
    name: "Ping Pong",
    description: "Classic paddle showdown in real-time",
    controlHint: "Use W/S or ↑/↓ to move your paddle",
    instruction: "Move your paddle with W/S or ↑/↓ (drag on touch). First to 5 points wins."
  },
  rockpaperscissors: {
    name: "Rock Paper Scissors",
    description: "Classic hand game - choose rock, paper, or scissors",
    instruction: "Pick Rock, Paper, or Scissors each round. Rock beats scissors, scissors beats paper, paper beats rock.",
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors"
  },
  connectfour: {
    name: "Connect Four",
    description: "Drop discs and connect four in a row to win",
    instruction: "Drop discs into a column on your turn. Connect four in a row to win."
  },
  lobby: {
    searchingTitle: "Searching for opponent...",
    quick: "Quick",
    invite: "Invite",
    searchError: "Failed to find a match. Please try again.",
    createLobbyError: "Failed to create lobby. Please try again."
  },
  waiting: {
    subtitle: "Waiting for opponent to accept invite or join...",
    startVsAI: "Start Game (vs AI)",
    inviteFriend: "Invite Friend",
    cancelMatch: "Cancel Match"
  },
  ready: {
    title: "OPPONENT FOUND!",
    startGame: "Start Game",
    waitingForStart: "Waiting for host to start..."
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
    firstTo: "First to {score}"
  },
  invite: {
    title: "Invite a Friend",
    cancel: "Cancel",
    searchFriends: "Search friends...",
    noFriends: "No friends found"
  },
  result: {
    winShort: "WIN",
    loseShort: "LOSE",
    drawShort: "DRAW",
    playAgain: "Play Again",
    backToLobby: "Back to Lobby",
    waiting: "Waiting...",
    accept: "Accept",
    reject: "Reject",
    playAgainRequest: "wants to play again!"
  }
}
;

type GameTranslations = typeof en;

export { en, type GameTranslations };
