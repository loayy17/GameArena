const fr = {
  welcome: (name: string) => `Bon retour${name ? `, ${name}` : ""}`,
  welcomeDesc: "Choisissez un jeu, invitez un ami et grimpez dans le classement.",
  playNow: "Jouer",
  record: {
    wins: "Victoires",
    losses: "Défaites",
    draws: "Nuls"
  },
  unreadMessages: "Messages non lus",
  friendRequests: "Demandes d'ami",
  gamesTitle: "Jeux",
  viewAllGames: "Tout voir",
  recentHistory: {
    title: "Batailles récentes",
    viewAll: "Tout voir",
    emptyTitle: "Aucune bataille pour l'instant",
    emptyDescription: "Jouez votre première partie et votre historique s'affichera ici."
  }
};

export { fr };
