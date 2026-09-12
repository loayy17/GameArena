const fr = {
  title: "Politique de confidentialité",
  updated: "Dernière mise à jour : septembre 2026",
  intro:
    "La présente politique de confidentialité explique comment GameArena (« nous », « notre » ou « nos ») collecte, utilise, stocke et protège vos données personnelles lorsque vous utilisez notre application web. En créant un compte ou en utilisant le service, vous acceptez les pratiques décrites dans cette politique.",
  dataCollectedTitle: "Données que nous collectons",
  dataCollected: [
    "Informations de compte : votre adresse e-mail, votre nom d'utilisateur unique, vos prénom et nom, une empreinte salée de votre mot de passe (jamais le mot de passe lui-même), votre statut de vérification et votre date d'inscription. Nous ne demandons ni ne stockons votre âge, votre date de naissance, votre numéro de téléphone ou votre adresse.",
    "Photo de profil : si vous téléversez un avatar, le fichier image (jusqu'à environ 2 Mo : PNG, JPEG, WebP ou GIF) est stocké sur nos serveurs et servi via un lien public. Vous pouvez le remplacer ou le supprimer à tout moment dans les Paramètres.",
    "Préférences : langue, thème, son, visibilité du statut en ligne et de l'activité de jeu, préférences de notifications et taille des pages. Elles sont stockées sur votre appareil et aussi synchronisées avec votre compte.",
    "Données de jeu : matchs terminés (jeu, joueurs, scores et date) et votre rang basé sur des points. Les parties en cours non terminées n'existent qu'en mémoire temporaire du serveur et ne sont jamais stockées.",
    "Données sociales : votre liste d'amis, vos demandes d'ami envoyées et reçues et leurs issues, vos utilisateurs bloqués et le contenu intégral de vos messages directs, y compris leur état de lecture. Bloquer quelqu'un l'empêche aussi de vous écrire ou d'interagir avec vous comme ami.",
    "Notifications : les avis stockés pour vous (demandes d'ami, invitations de jeu, réponses, avis système) et le fait que vous les ayez lus ou non.",
    "Enregistrements de sécurité : jetons d'actualisation de session hachés, codes de vérification à usage unique hachés avec leur expiration, et horodatages d'activité du compte. Nos journaux serveur peuvent enregistrer votre adresse e-mail lorsqu'un e-mail de vérification ou de réinitialisation vous est envoyé.",
  ],
  dataUseTitle: "Comment nous utilisons vos données",
  dataUse: [
    "Pour créer et sécuriser votre compte : vérification de l'e-mail avant la première connexion, contrôle du mot de passe et sessions signées de courte durée.",
    "Pour faire fonctionner les fonctionnalités : jeux en temps réel, salons de match, amis, blocage, chat, recherche, notifications et historique des matchs.",
    "Pour montrer les bonnes choses aux bonnes personnes : votre nom d'utilisateur et votre nom complet peuvent être recherchés par tout utilisateur connecté ; vos statistiques détaillées ne sont visibles que par vous et vos amis ; vos listes d'amis et de bloqués ne sont visibles que par vous ; les messages ne sont visibles que par leurs participants.",
    "Pour protéger le service : validation des entrées, règles de robustesse des mots de passe, délais entre les envois de codes de vérification, et révocation des sessions à la déconnexion ou au changement de mot de passe.",
    "Pour ne vous envoyer que les e-mails que vous déclenchez : codes de vérification d'inscription et codes de réinitialisation de mot de passe. Nous n'envoyons ni infolettres ni e-mails marketing.",
    "Nous n'exploitons ni analytique, ni suivi comportemental, ni publicité sur le Service.",
  ],
  cookiesTitle: "Cookies et stockage local",
  cookies:
    "Nous utilisons des cookies strictement nécessaires : un cookie de jeton d'accès HttpOnly, Secure, SameSite=None (expire après 15 minutes) et un cookie de jeton d'actualisation (mêmes attributs, expire après 7 jours) qui vous maintiennent connecté, plus des cookies lisibles de langue et de thème SameSite=Lax (conservés un an) qui mémorisent votre langue et votre apparence. Le stockage local de votre navigateur contient les mêmes choix de langue et de thème ainsi que la disposition de votre barre latérale. Les polices de l'application sont servies depuis notre propre domaine. Nous n'utilisons aucun cookie publicitaire ou de suivi tiers.",
  sharingTitle: "Partage des données",
  sharing:
    "Nous ne vendons pas vos données personnelles et nous ne partageons ni vos messages, ni vos listes d'amis, ni votre historique de jeu avec des tiers. Les données ne sont partagées que lorsque c'est nécessaire au fonctionnement du Service : notre base de données PostgreSQL et notre infrastructure d'hébergement, qui stockent les données décrites ci-dessus, et notre prestataire d'envoi d'e-mails Brevo, qui reçoit votre adresse e-mail, votre nom d'utilisateur et le code de vérification lorsque nous vous écrivons. Ces prestataires traitent les données pour notre compte.",
  retentionTitle: "Conservation des données",
  retention:
    "Les données de votre compte sont conservées tant que votre compte existe. Les messages, les notifications et l'historique des matchs n'ont pas d'expiration automatique et sont conservés jusqu'à la suppression de votre compte. Les jetons de session sont supprimés à la déconnexion, à leur rotation ou au changement de mot de passe ; les jetons expirés sont rejetés. Les codes de vérification utilisés sont conservés comme enregistrements consommés. Le Service n'offre pas de suppression en libre-service : pour faire supprimer votre compte et ses données associées, ou pour en recevoir une copie, contactez-nous à l'e-mail ci-dessous avec une demande vérifiée et nous la traiterons manuellement dans un délai raisonnable.",
  rightsTitle: "Vos droits",
  rights: [
    "Accès : votre page de profil et vos Paramètres affichent les données personnelles détenues sur vous.",
    "Correction : vous pouvez modifier vos prénom et nom, nom d'utilisateur, adresse e-mail, mot de passe, avatar et préférences à tout moment dans les Paramètres.",
    "Suppression : faute de suppression automatique, contactez-nous à l'e-mail ci-dessous et nous supprimerons votre compte et ses données associées après vérification de votre demande.",
    "Portabilité : contactez-nous et nous vous fournirons les données liées à votre compte dans un format lisible.",
  ],
  securityTitle: "Sécurité",
  security:
    "Les mots de passe ne sont stockés que sous forme d'empreintes salées à sens unique basées sur PBKDF2 et ne sont jamais conservés en texte brut. Les sessions utilisent des jetons signés HMAC de courte durée ; les jetons d'actualisation sont stockés comme empreintes SHA-256 et renouvelés à chaque utilisation. Les codes de vérification comptent 6 chiffres, sont stockés comme empreintes SHA-256, à usage unique, valables 15 minutes, et leur renvoi est limité à un code par minute. Les mots de passe doivent compter de 8 à 64 caractères avec majuscules et minuscules, un chiffre et un symbole. Les cookies d'authentification portent les attributs HttpOnly et Secure, les avatars sont limités en taille et en type de fichier, et changer votre mot de passe met fin immédiatement à toutes les autres sessions.",
  contactTitle: "Contact et modifications",
  contact:
    "Si vous avez des questions sur cette politique de confidentialité, contactez l'équipe à hindiloay01@gmail.com. Nous pouvons mettre à jour cette politique de temps à autre ; la version la plus récente sera toujours publiée sur cette page avec sa date de révision.",
  backToHome: "Retour à l'accueil",
  termsLink: "Lire nos conditions d'utilisation",
};

export { fr };
