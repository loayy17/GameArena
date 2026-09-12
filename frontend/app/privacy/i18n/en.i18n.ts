const en = {
  title: "Privacy Policy",
  updated: "Last updated: September 2026",
  intro:
    "This Privacy Policy explains how GameArena (\"we\", \"us\", or \"our\") collects, uses, stores, and protects your personal data when you use our web application. By creating an account or using the service, you agree to the practices described in this policy.",
  dataCollectedTitle: "Data We Collect",
  dataCollected: [
    "Account information: your email address, unique username, first and last name, a salted hash of your password (never the password itself), your verification status, and the date you registered. We do not ask for your age, birth date, phone number, or address.",
    "Profile picture: if you upload an avatar, the image file (up to about 2 MB: PNG, JPEG, WebP, or GIF) is stored on our servers and served through a public link. You can replace or remove it at any time in Settings.",
    "Preferences: language, theme, sound, online-status and game-activity visibility, notification preferences, and list page size. These are stored on your device and also synced to your account.",
    "Game data: completed matches (game, players, scores, and date) and your points-based rank. Live, unfinished games exist only in the server's temporary memory and are never stored.",
    "Social data: your friends list, sent and received friend requests and their outcomes, blocked users, and the full content of your direct messages, including read state. Blocking also prevents the blocked person from messaging you or interacting with you as a friend.",
    "Notifications: the notices stored for you (friend requests, game invites, replies, system notices) and whether you have read them.",
    "Security records: hashed session refresh tokens, hashed single-use verification codes with their expiry, and account activity timestamps. Our server logs may record your email address when a verification or reset email is sent to you.",
  ],
  dataUseTitle: "How We Use Your Data",
  dataUse: [
    "To create and secure your account: email verification before your first sign-in, password checks, and short-lived signed sessions.",
    "To run the features: real-time games, matchmaking lobbies, friends, blocking, chat, search, notifications, and match history.",
    "To show the right things to the right people: your username and full name are searchable by any signed-in user; your detailed match statistics are visible only to you and your friends; your friends and block lists are visible only to you; messages are visible only to their participants.",
    "To protect the service: input validation, password strength rules, verification-code sending cooldowns, and session revocation when you sign out or change your password.",
    "To send you only the emails you trigger: registration verification codes and password-reset codes. We send no newsletters and no marketing emails.",
    "We do not run analytics, behavioral tracking, or advertising on the Service.",
  ],
  cookiesTitle: "Cookies and Local Storage",
  cookies:
    "We use strictly necessary cookies: an HttpOnly, Secure, SameSite=None access-token cookie (expires after 15 minutes) and refresh-token cookie (expires after 7 days) that keep you signed in, plus readable SameSite=Lax locale and theme cookies (kept for one year) that remember your language and appearance. Your browser's local storage holds the same language and theme choices and your sidebar layout. The application's fonts are served from our own domain. We use no advertising or third-party tracking cookies.",
  sharingTitle: "Data Sharing",
  sharing:
    "We do not sell your personal data, and we do not share your messages, friends lists, or game history with third parties. Data is shared only where needed to operate the Service: our PostgreSQL database and hosting infrastructure, which store the data described above, and our email delivery provider Brevo, which receives your email address, username, and the verification code when we send you an email. These providers process data on our behalf.",
  retentionTitle: "Data Retention",
  retention:
    "Your account data is kept while your account exists. Messages, notifications, and match history have no automatic expiry and are kept until your account is removed. Session tokens are deleted when you sign out, when they are rotated, or when you change your password; expired tokens are rejected. Used verification codes are kept as spent records. The Service has no self-service deletion button: to have your account and associated data removed, or to receive a copy of your data, contact us at the email below with a verified request and we will process it manually within a reasonable period.",
  rightsTitle: "Your Rights",
  rights: [
    "Access: your profile page and Settings show the personal data held about you.",
    "Correction: you can change your first and last name, username, email address, password, avatar, and preferences at any time in Settings.",
    "Deletion: because there is no automatic deletion feature, contact us at the email below and we will delete your account and associated data after verifying your request.",
    "Portability: contact us and we will provide the data associated with your account in a readable format.",
  ],
  securityTitle: "Security",
  security:
    "Passwords are stored only as salted PBKDF2-based one-way hashes and are never kept as plain text. Sign-in sessions use short-lived HMAC-signed tokens; refresh tokens are stored as SHA-256 hashes and rotated on every use. Verification codes are 6 digits, stored as SHA-256 hashes, single-use, valid for 15 minutes, and re-sending is limited to one code per minute. Passwords must be 8–64 characters with upper- and lower-case letters, a digit, and a symbol. Authentication cookies are flagged HttpOnly and Secure, avatars are limited by size and file type, and changing your password immediately ends all other sessions.",
  contactTitle: "Contact and Changes",
  contact:
    "If you have questions about this Privacy Policy, contact the team at hindiloay01@gmail.com. We may update this policy from time to time; the latest version will always be published on this page with its revision date.",
  backToHome: "Back to home",
  termsLink: "Read our Terms of Service",
};

type TPrivacyTranslation = typeof en;

export { en, type TPrivacyTranslation };
