const en = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  lastUpdated: "Last updated: 16 August 2026",
  brand: "Arena 404",
  backHome: "Back to Arena",
  legalNav: "Legal",
  privacyPage: {
    title: "Privacy Policy",
    subtitle: "How Arena 404 collects, uses, and protects your information.",
    intro:
      "Arena 404 is a real-time multiplayer gaming platform. This Privacy Policy explains what personal data we process when you create an account, play games, chat with other players, and use social features. By using the service you acknowledge this policy. If you do not agree, please do not use Arena 404.",
    sections: [
      {
        title: "1. Who we are",
        body: "Arena 404 is an academic web application created as part of the 42 curriculum (ft_transcendence). It is operated by the project team for educational evaluation and demonstration. It is not a commercial product and is not intended for production-scale public hosting outside the evaluation environment.",
      },
      {
        title: "2. Data we collect",
        body: "Account data: email address, username, first name, last name, and a hashed password. We never store your password in plain text. Profile and preferences: language, theme, and other settings you choose. Gameplay data: match history, scores, game type, opponents, and timestamps. Social data: friend requests, friend relationships, blocks, private messages, read state, and online/in-game presence. Security data: refresh tokens (hashed), email verification and password-reset one-time codes (hashed, time-limited). Technical data: cookies required for authentication and connection metadata needed for real-time gameplay.",
      },
      {
        title: "3. How we use your data",
        body: "We use your data to create and secure your account, authenticate sessions, send verification and password-reset emails, match you with other players, run live games, show match history, deliver friend requests, chat messages and game invites, display online status to friends, and keep the platform stable. We do not sell personal data and we do not use it for advertising.",
      },
      {
        title: "4. Cookies and authentication",
        body: "Arena 404 uses HTTP-only, Secure cookies to store a short-lived access token and a refresh token. These cookies are required to keep you signed in and to authorize API and WebSocket (SignalR) connections. They are not used for third-party tracking or advertising analytics. Clearing cookies will sign you out.",
      },
      {
        title: "5. Chat, presence, and social features",
        body: "Private messages are stored so you and the recipient can see conversation history. Friends can see whether you are online, offline, or in a game. You can block another user to stop social interaction from that account. Do not send passwords, payment details, or other sensitive information through chat.",
      },
      {
        title: "6. Email delivery",
        body: "Account verification and password-reset messages may be sent through an email delivery provider (currently Brevo) using the address you registered with. The provider processes the recipient address and message content solely to deliver that email.",
      },
      {
        title: "7. Legal bases and retention",
        body: "We process data because it is necessary to provide the service you requested (account, games, chat) and to keep the platform secure. Account, match history, messages, and social records are kept while your account exists. One-time verification codes expire after a short period. Refresh tokens expire and can be revoked on logout. If the evaluation instance is reset, stored data may be deleted with the database volume.",
      },
      {
        title: "8. Sharing",
        body: "We do not sell or rent your personal data. Data may be processed by infrastructure we use to run the app (database, containers, email provider). Other players can see the public parts of your profile needed for play: username, display name, online status, match results against them, and messages you send them. Administrators of the evaluation environment may access the database for debugging or grading.",
      },
      {
        title: "9. Security",
        body: "Passwords are hashed with a salted algorithm. Tokens and OTPs are hashed at rest. Browser traffic is served over HTTPS. Real-time game and chat connections use encrypted transport from the browser to the reverse proxy. No method of transmission or storage is perfectly secure; you are responsible for choosing a strong password and keeping your device safe.",
      },
      {
        title: "10. Your choices and rights",
        body: "You can update your name and username from Settings, change your password, and control language and theme preferences. You may ask the team to correct inaccurate account data or to delete your account and associated records where feasible for the evaluation instance. You can stop using the service at any time. Because this is an academic project, automated self-serve data export and erasure tools may be limited; contact the team using the details in the project README.",
      },
      {
        title: "11. Children",
        body: "Arena 404 is intended for users who can lawfully create an online account in their jurisdiction, typically 16 years or older. We do not knowingly collect data from children. If you believe a child has created an account, contact the team so the account can be removed.",
      },
      {
        title: "12. International access",
        body: "The application may be hosted on local machines or cloud instances used for 42 evaluation. Data may be processed in the country where the instance is running. Do not submit data you are not allowed to transfer to that environment.",
      },
      {
        title: "13. Changes",
        body: "We may update this Privacy Policy when features change. The “Last updated” date at the top of this page will change. Continued use after an update means you accept the revised policy.",
      },
      {
        title: "14. Contact",
        body: "For privacy questions, account deletion requests, or data concerns, contact the Arena 404 team through the repository listed in the project README. This policy applies to the Arena 404 application and its evaluation deployment, not to third-party websites you may reach from it.",
      },
    ],
  },
  termsPage: {
    title: "Terms of Service",
    subtitle: "The rules for using Arena 404, playing games, and interacting with other players.",
    intro:
      "These Terms of Service govern access to Arena 404, a multiplayer gaming web application. By creating an account or using the platform you agree to these terms. If you do not agree, do not use the service.",
    sections: [
      {
        title: "1. The service",
        body: "Arena 404 lets registered users play real-time games (including Tic-Tac-Toe, Ping Pong, Snake, Rock Paper Scissors, and Connect Four), search for matches, invite friends, chat, manage a friends list, and view match history. The project is developed for the 42 ft_transcendence curriculum. Features, availability, and stored data may change or be reset as part of development and evaluation.",
      },
      {
        title: "2. Eligibility and accounts",
        body: "You must provide a valid email address, choose a unique username, and set a password. You are responsible for keeping your credentials confidential and for activity on your account. You must verify your email when asked. One person should not create accounts to abuse matchmaking, harass others, or evade a block. We may refuse, suspend, or delete accounts that violate these terms.",
      },
      {
        title: "3. Acceptable use",
        body: "You agree not to: cheat, exploit bugs, or interfere with matchmaking or live games; attempt to access other users’ accounts or the database; probe, scan, or attack the service; send malware or excessive automated requests; impersonate another player or the team; scrape the service in a way that harms availability; or use the platform for anything unlawful. Reverse engineering for attacking the service is forbidden. Security research that follows responsible disclosure to the team is welcome.",
      },
      {
        title: "4. Games and fair play",
        body: "Games have published rules and win/loss conditions. Live matches depend on a network connection. Disconnecting may forfeit the round or replace you with a bot depending on the game flow. Match history records completed games. Playing against the AI bot is allowed. Do not disrupt other players’ matches or abuse reconnection behavior.",
      },
      {
        title: "5. Chat, friends, and invites",
        body: "You must not send harassment, hate speech, threats, sexual content involving minors, spam, or illegal material. You may block users and decline friend requests and game invites. Invites and messages are part of the social system; misuse (mass invites, scams, phishing) is a violation. We may remove content and restrict accounts that break these rules. Chat is not end-to-end encrypted; do not share secrets there.",
      },
      {
        title: "6. User content",
        body: "You retain rights to the text you submit (such as chat messages and profile names). You grant the project the right to store, display, and transmit that content as needed to operate Arena 404. You confirm you have the right to post that content and that it does not infringe others’ rights.",
      },
      {
        title: "7. Intellectual property",
        body: "The Arena 404 name, layout, original code, and design system are owned by the project team except where third-party licenses apply (for example Next.js, ASP.NET, Tailwind CSS, SignalR, and animation assets). You may not copy the service and present it as your own assessed work. Third-party libraries remain under their own licenses.",
      },
      {
        title: "8. Availability and academic context",
        body: "The service is provided as-is for education and evaluation. We do not guarantee uninterrupted uptime, persistence of data, or fitness for any commercial purpose. Instances may be rebuilt, migrated, or shut down. Matches in progress can be interrupted by deployments or disconnects.",
      },
      {
        title: "9. Disclaimers",
        body: "To the fullest extent permitted by law, Arena 404 and the project team disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. Games are for entertainment. We are not responsible for disputes between players beyond tools already in the product (block, decline invite, leave game).",
      },
      {
        title: "10. Limitation of liability",
        body: "To the fullest extent permitted by law, the team is not liable for indirect, incidental, or consequential damages, lost data, or lost gameplay progress arising from use of the service, including outages, bugs, or unauthorized access. If a jurisdiction does not allow certain limitations, those limitations apply only to the extent allowed.",
      },
      {
        title: "11. Termination",
        body: "You may stop using Arena 404 at any time. We may suspend access if you violate these terms, if required for security, or when the evaluation instance is retired. After termination, we may delete or anonymize account data as described in the Privacy Policy.",
      },
      {
        title: "12. Changes to the terms",
        body: "We may update these Terms when the product changes. The “Last updated” date will be revised. Continued use after a change constitutes acceptance. If you disagree with a change, stop using the service.",
      },
      {
        title: "13. Contact",
        body: "Questions about these Terms can be sent to the Arena 404 team via the project repository listed in the README. These Terms are the agreement between you and the team for use of this academic application.",
      },
    ],
  },
};

type TLegalTranslation = typeof en;
export { en, type TLegalTranslation };
