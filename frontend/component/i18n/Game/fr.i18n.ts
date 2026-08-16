const fr = {
  tictactoe: {
    name: "Tic Tac Toe",
    description: "Placez des marques stratégiques dans un duel classique 3x3",
    instruction: "Placez à tour de rôle un X ou un O. Alignez trois symboles pour gagner."
  },
  snake: {
    name: "Snake",
    description: "Faites grandir votre serpent et dominez l'arène",
    arrowKeysHint: "Utilisez les flèches du clavier pour vous déplacer",
    instruction: "Dirigez-vous avec les flèches ou en glissant pour manger de la nourriture et grandir. Ne touchez pas les murs ni votre adversaire."
  },
  pingpong: {
    name: "Ping Pong",
    description: "Duel de raquettes classique en temps réel",
    controlHint: "Utilisez W/S ou ↑/↓ pour déplacer votre raquette",
    instruction: "Déplacez votre raquette avec W/S ou ↑/↓ (glissez sur écran tactile). Le premier à 5 points gagne."
  },
  rockpaperscissors: {
    name: "Rock Paper Scissors",
    description: "Jeu de main classique - choisissez pierre, papier ou ciseaux",
    instruction: "Choisissez Pierre, Papier ou Ciseaux à chaque manche. La pierre bat les ciseaux, les ciseaux battent le papier, le papier bat la pierre.",
    rock: "Pierre",
    paper: "Papier",
    scissors: "Ciseaux"
  },
  connectfour: {
    name: "Connect Four",
    description: "Lâchez des jetons et alignez-en quatre pour gagner",
    instruction: "Lâchez des jetons dans une colonne à votre tour. Alignez-en quatre pour gagner."
  },
  lobby: {
    searchingTitle: "Recherche d'un adversaire...",
    quick: "Rapide",
    invite: "Inviter",
    searchError: "Échec de la recherche d'un match. Veuillez réessayer.",
    createLobbyError: "Échec de la création du lobby. Veuillez réessayer."
  },
  waiting: {
    subtitle: "En attente de l'acceptation de l'invitation ou de la connexion de l'adversaire...",
    startVsAI: "Commencer la partie (contre l'IA)",
    inviteFriend: "Inviter un ami",
    cancelMatch: "Annuler le match"
  },
  ready: {
    title: "ADVERSAIRE TROUVÉ !",
    startGame: "Commencer la partie",
    waitingForStart: "En attente du démarrage de l'hôte..."
  },
  game: {
    you: "Vous",
    youSuffix: "(Vous)",
    aiBot: "Bot IA",
    turn: "Tour",
    vs: "VS",
    opponent: "Adversaire",
    waiting: "En attente...",
    player1: "Joueur 1",
    player2: "Joueur 2",
    yourTurn: "À votre tour - Faites votre mouvement !",
    waitingFor: "En attente de {name}...",
    leaveGame: "Quitter la partie",
    firstTo: "Premier à {score}"
  },
  invite: {
    title: "Inviter un ami",
    cancel: "Annuler",
    searchFriends: "Rechercher des amis...",
    noFriends: "Aucun ami trouvé"
  },
  result: {
    winShort: "VICTOIRE",
    loseShort: "DÉFAITE",
    drawShort: "ÉGALITÉ",
    playAgain: "Rejouer",
    backToLobby: "Retour au lobby",
    waiting: "En attente...",
    accept: "Accepter",
    reject: "Refuser",
    playAgainRequest: "veut rejouer !"
  }
}
;

export { fr };