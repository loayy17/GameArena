const en = {
  title: "Privacy Policy",
  updated: "Last updated: August 2026",
  intro:
    "This Privacy Policy explains how GameArena (\"we\", \"us\", or \"our\") collects, uses, stores, and protects your personal data when you use our web application. By creating an account or using the service, you agree to the practices described in this policy.",
  dataCollectedTitle: "Data We Collect",
  dataCollected: [
    "Account information: your email address, username, first and last name, hashed password, and profile preferences (language, theme).",
    "Profile data: your chosen display name, language, theme, and other preference settings.",
    "Game data: match history, scores, and results of the games you play (Tic-Tac-Toe, Ping-Pong, Snake, Rock-Paper-Scissors, Connect Four).",
    "Social data: your friends list, friend requests (sent/received), blocked users, and chat messages sent and received.",
    "Notifications: the list of notifications delivered to your account (friend requests, game invites, system notices).",
    "Technical data: connection timestamps used to display online/offline status to your friends.",
  ],
  dataUseTitle: "How We Use Your Data",
  dataUse: [
    "To create and manage your account and authenticate you securely via JWT in HttpOnly, Secure cookies.",
    "To provide the games, matchmaking, chat, friends, and notification features.",
    "To display your profile, Elo rank, and match history to you and, where applicable, to your friends.",
    "To keep the service secure and prevent abuse, cheating, and fraudulent activity.",
    "To improve the application based on aggregate usage patterns.",
  ],
  cookiesTitle: "Cookies and Local Storage",
  cookies:
    "We use HttpOnly, Secure, SameSite=None cookies to store your authentication tokens (access token, refresh token). These cookies are required for the service to function. We use local storage only for your preferred language and theme on your device. We do not use third-party advertising or tracking cookies.",
  sharingTitle: "Data Sharing",
  sharing:
    "We do not sell your personal data. We share data only with the service providers required to operate the application: our database provider (PostgreSQL), our hosting providers, and our email delivery provider (used to send verification codes and password reset emails). These providers process data on our behalf and are bound by appropriate agreements.",
  retentionTitle: "Data Retention",
  retention:
    "Your account data is retained for as long as your account is active. Chat messages, notifications, and match history are kept to provide the corresponding features. Refresh tokens are stored hashed and removed when they expire or when you log out. You may request deletion of your account and associated data by contacting us; after verification, your personal data is deleted within a reasonable period, except where retention is required by law.",
  rightsTitle: "Your Rights",
  rights: [
    "Access: you can view the personal data we hold about you through your profile and settings.",
    "Correction: you can update your profile information (name, username, language, theme, avatar) at any time in the Settings page.",
    "Deletion: you can request deletion of your account and associated data by contacting us at the email below.",
    "Export: upon request, we will provide your data in a readable format.",
  ],
  securityTitle: "Security",
  security:
    "Passwords are hashed with a salted, one-way algorithm and are never stored in plain text. Authentication tokens are transmitted over HTTPS and stored in secure HttpOnly, SameSite=None cookies. We apply input validation, rate limiting on sensitive endpoints (e.g., email verification), and access controls to protect the application and its users.",
  contactTitle: "Contact and Changes",
  contact:
    "If you have questions about this Privacy Policy, contact the team at hindiloay01@gmail.com. We may update this policy from time to time; the latest version will always be published on this page with its revision date.",
  backToHome: "Back to home",
  termsLink: "Read our Terms of Service",
};

type TPrivacyTranslation = typeof en;

export { en, type TPrivacyTranslation };