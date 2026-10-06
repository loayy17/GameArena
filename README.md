*_This project has been created as part of the 42 curriculum by lalhindi, oissa, oshawish, zsaleh, hamza._*

# Arena 404

## Description

**Arena 404** is a real-time, multi-game web arena where players compete against each other — or against built-in AI opponents — in five classic games, while a full social layer (friends, live chat, notifications) and a competitive layer (ranks, levels, match history, leaderboard) keep them engaged.

**Goal:** deliver a production-grade, multi-user web application with a real frontend, backend, and database, deployed with a single command and served exclusively over HTTPS — as required by the ft_transcendence subject.

### Key features

- **5 playable web games:** Tic-Tac-Toe, Ping-Pong, Snake (1v1), Rock-Paper-Scissors, Connect Four
- **Real-time multiplayer:** matchmaking queue, private lobbies, friend invites, reconnection grace period, play-again flow
- **AI opponents** for all 5 games (minimax, predictive tracking, greedy heuristics, random), with human-like delays
- **Social system:** friends, friend requests, blocking, online/playing status, private live chat (typing indicators, read receipts, game invites from chat), persistent notifications
- **Competitive system:** win/loss/draw stats, rank & level progression, full match history, leaderboard
- **Admin panel:** role hierarchy (User / Moderator / Admin / SuperAdmin), user search, ban/unban, role change, user deletion
- **Public REST API:** API-key secured, per-key rate limited, Swagger-documented CRUD (feedback endpoints)
- **Internationalization:** full English / Arabic / French translations with complete RTL layout support
- **Theming & accessibility:** dark/light themes, 35-component custom design system, ARIA roles, focus traps, keyboard navigation
- **Legal & compliance pages:** real Privacy Policy and Terms of Service content

---

## Instructions

### Prerequisites

| Tool | Version | Required for |
|---|---|---|
| Docker Desktop (with Compose v2) | any recent | **running the project (only hard requirement)** |
| Git | any | cloning the repository |
| .NET SDK | 10.0 | local backend development only (optional) |
| Node.js | 22 | local frontend development only (optional) |

### Setup

1. Clone the repository and enter it:
   ```bash
   git clone <repo-url> gamearena && cd gamearena
   ```
2. Create your environment file and fill in the values:
   ```bash
   cp .env.example .env
   ```
   Every value is documented inside `.env.example`. At minimum set:
   - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
   - `ConnectionStrings__DefaultConnection` (format given in `.env.example`)
   - `JWT__Token`, `JWT__Issuer`, `JWT__Audience`
   - `PublicApi__ApiKey` (random, min 32 chars)
   - `EmailSettings__*` (SMTP credentials — used for the email-verification / password-reset OTP codes)
   - `SuperAdmin__Email`, `SuperAdmin__UserName`, `SuperAdmin__Password` (the role is never assignable through the API/UI, so this is the only way to create one)

   > `.env` is ignored by Git. Never commit real credentials.

### Run (single command)

```bash
docker compose up --build
```

This starts 4 containers: `database` (PostgreSQL 17), `backend` (ASP.NET Core 10), `frontend` (Next.js 16), `nginx` (HTTPS reverse proxy). Database migrations apply automatically at backend startup, and nginx generates a self-signed TLS certificate for `localhost` on first boot.

### Access

| URL | Purpose |
|---|---|
| **https://localhost** | the application (accept the self-signed certificate warning once) |
| https://localhost/swagger | interactive API documentation (set `Swagger__Disabled=true` to hide) |
| https://localhost/api/health | health check endpoint |
| https://localhost/health | frontend status page |
| http://localhost | permanently redirects (301) to HTTPS |

Useful commands:

```bash
docker compose down          # stop everything
docker compose down -v       # stop everything AND wipe the database volume
docker compose logs -f backend   # follow backend logs
```

### Local development (optional, without Docker)

```bash
dotnet run --project backend          # backend on http://localhost:8080 (needs a reachable PostgreSQL)
cd frontend && npm ci && npm run dev  # frontend on http://localhost:3000
```

---

## Team Information

| Login | Role(s) | Responsibilities |
|---|---|---|
| `lalhindi` | Scrum Master (PM) · Tech Lead · Developer | Facilitates planning and weekly syncs; backend real-time & game architecture; Docker/nginx infrastructure; integration and final audit fixes |
| `oissa` | Tech Lead · Developer | Backend services: authentication (JWT, refresh tokens), email OTP flows, friends/chat services; database schema and migrations |
| `oshawish` | Product Owner · Developer | Product vision, backlog and priorities; dashboard/social frontend pages; feature acceptance and validation |
| `zsaleh` | Developer | Custom design system components; internationalization (en/ar/fr) and RTL support; theming |
| `hamza` | Tech Lead · Developer | Game canvases and lobby UX; admin dashboard; code quality review |

> **Note on commits:** the team developed mostly through pair-programming sessions on one shared laptop, so the majority of commits were pushed through `lalhindi`'s GitHub account. Some members also committed directly. Feature ownership below reflects actual responsibility, agreed and verified by the whole team.

---

## Project Management

- **Task distribution:** the work was broken down module by module (games, social, auth, admin, infra, design system), and each module was assigned an owner (see *Features* and *Modules* sections). Weekly scope was agreed together before implementation started.
- **Meetings:** weekly planning and review on **Discord**; working/pairing sessions over **Google Meet**; day-to-day coordination and scheduling on **WhatsApp**.
- **Code review:** the Tech Leads reviewed critical changes (game rooms, auth, real-time hubs) before merging.
- **Quality gate near the end:** a full codebase audit was performed (35 tracked defects, B1–B35) — security, race conditions, API contract and UX issues — and every item was fixed, documented as a design decision, or verified as already fixed before submission.

---

## Technical Stack

### Frontend
- **Next.js 16** (App Router, Server-Side Rendering) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (CSS-first `@theme` configuration — no `tailwind.config`)
- **@microsoft/signalr** client for real-time comms, **axios** for REST
- **lucide-react** icons, **Lottie** animations

### Backend
- **ASP.NET Core 10** (`.NET 10`), controllers + SignalR hubs
- **SignalR** (2 hubs: `GameHub`, `SocialHub`) for all real-time traffic
- **Entity Framework Core 10** + **Npgsql** (ORM + migrations)
- JWT bearer auth via HttpOnly cookies, rotating SHA-256-hashed refresh tokens, PBKDF2 password hashing
- **Built-in rate limiting** — three fixed-window policies: per-IP auth (10/min) on register / login / forgot-password / reset-password, per-IP session (60/min) on refresh / logout, and per-key public API (60/min)
- **Swashbuckle** (Swagger/OpenAPI) for API documentation
- **Brevo SMTP** for transactional emails (verification + password reset OTP)
- Uniform error envelope (`ApiResponse` + numeric error codes) via a global exception handler

### Database
- **PostgreSQL 17** — chosen for strict relational integrity (friendships, blocks, messages, match history), transactional guarantees for concurrent multi-user writes, and first-class EF Core support.

### Infrastructure
- **Docker Compose** — single-command deployment of the whole stack
- **nginx** — TLS termination (self-signed cert auto-generated for development), HTTP→HTTPS redirect, reverse proxy for frontend/backend, WebSocket upgrade for both SignalR hubs

### Why these choices
- **Next.js + ASP.NET Core** satisfies the "framework on both ends" major module with two mature, well-documented ecosystems, and SSR keeps first paint fast and SEO-friendly.
- **SignalR** provides production-grade WebSocket handling (automatic reconnection, backplanes, strongly-typed hubs) instead of hand-rolled socket management.
- **EF Core + PostgreSQL** lets the schema live in code (16 versioned migrations) with safe concurrent multi-user data handling.

---

## Database Schema

10 tables (EF Core, verified against the running container):

| Table | Key fields | Relations / constraints |
|---|---|---|
| `Users` | `Id` PK, `UserName` (unique), `Email` (unique), `PasswordHash`, `FirstName`, `LastName`, `Avatar` (byte[]), `AvatarContentType`, `Rank` (double?), `Role` (enum), `IsBanned`, `IsVerified`, `Preferences`, `CreatedAt` | referenced by almost everything below |
| `RefreshTokens` | `Id` PK, `TokenHash` (unique, SHA-256 at rest), expiry | FK → `Users` (cascade) |
| `EmailVerifications` | hashed 6-digit OTP, purpose (register / password-reset), expiry, failed-attempt counter, resend cooldown | FK → `Users`; rows cleaned by a background sweep |
| `FriendRequests` | composite PK (`SenderId`, `ReceiverId`), status | FK → `Users` (restrict) |
| `UserFriends` | composite PK (`UserId`, `FriendId`) | FK → `Users` (restrict) |
| `Blocks` | composite PK (`BlockerId`, `BlockedId`) | FK → `Users` (restrict) |
| `Messages` | `Id` PK, content (max 4000 chars), `IsRead`, `CreatedAt` | FK sender → cascade, receiver → restrict |
| `Notifications` | `Id` PK, type (FriendRequest / FriendRequestAccepted / GameInvite / NewMessage), title, body, `ReferenceId`, `IsRead` | FK → `Users` (cascade) |
| `MatchHistories` | `Id` PK, `RoomId`, `GameType` (enum: TicTacToe, PingPong, Snake, RockPaperScissors, ConnectFour), per-player scores, `CompletedAt` | FK `Player1`/`Player2` → `Users` (restrict, nullable) |
| `Feedbacks` | `Id` PK, title, message, category enum, `CreatedAt`/`UpdatedAt` | resource exposed through the public API |

Live game rooms are intentionally **in-memory** (singleton service, lock-protected state); only finished human-vs-human matches are persisted to `MatchHistories` and update player ranks.

---

## Features List

### Authentication & accounts — *owner: oissa*
- Register / login with email + password (PBKDF2 hashed, salted)
- Email verification with 6-digit OTP (hashed at rest, 15-min expiry, 60s resend cooldown, max 5 attempts)
- Forgot / reset password via OTP email
- 15-min JWT access token + 7-day rotating refresh token (HttpOnly cookies); banned users are blocked on login and refresh
- Credential endpoints are rate limited to 10 req/min per IP; token refresh and logout get their own 60 req/min budget so that routine page loads can never lock a user out of signing in

### Social system — *owners: oissa (backend), oshawish (frontend)*
- Friends: search users, send/accept/decline/cancel requests, remove friends, block/unblock
- Live presence: online / offline / in-game status
- Private chat: real-time messages, optimistic UI with server echo, typing indicators (throttled), read receipts, unread badges, 500-message bounded history
- Notifications: friend requests, acceptances, game invites, new messages — bell badge, notification center with inline actions (accept invite, reply, mark read), global toast popups; real-time counters over SignalR

### Games — *owners: lalhindi (rooms, bots, hub), hamza (game UI)*
- 5 games: Tic-Tac-Toe, Ping-Pong, Snake (1v1), Rock-Paper-Scissors, Connect Four
- Matchmaking queue (first open room of the same game), private lobbies, friend invites
- Play-again flow, 30-second reconnection grace period, disconnected players replaced by bots mid-game
- AI bots for every game with selectable **Easy / Medium / Hard** difficulty (chosen per room by its creator; also applied to the replacement bot when a player disconnects mid-match)
- Keyboard (arrows/WASD) + touch/drag controls, 20 Hz Pong / 10 Hz Snake server-authoritative game loops

### Profiles & competition — *owners: zsaleh, oshawish*
- Profile pages: avatar (upload ≤2 MB, PNG/JPEG/WebP/GIF, default avatar fallback), stats (wins/losses/draws/win-rate), rank → level + progress bar, member-since, share link
- Match history page with filters (All / Win / Loss / Draw)
- Leaderboard: top-20 by rank, medal badges, live status, "you" highlight
- Settings: profile info edit (with uniqueness checks + email-change re-verification), avatar upload/remove, password change

### Administration — *owner: hamza*
- Staff-only `/admin` dashboard: platform stats (total/online/in-game/banned users), debounced user search + role/status filters
- Ban / unban (revokes all sessions), change role, delete user
- Strict role hierarchy enforced server-side (**SuperAdmin > Admin > Moderator > User**): a SuperAdmin can grant Admin / Moderator / User; an Admin can grant Moderator / User; Moderators and regular users cannot change roles; nobody can act on an equal or higher role
- On every boot the backend looks up `SuperAdmin__Email`: unregistered means the account is created, registered under a lower role means it is promoted, and an existing SuperAdmin is left untouched. The step is skipped when the email or password is unset, and a password that fails the signup policy stops the boot rather than creating a weak SuperAdmin

### Public API — *owner: lalhindi*
- `GET /api/public/feedback?limit=&offset=` · `GET /api/public/feedback/{id}` · `POST /api/public/feedback` · `PUT /api/public/feedback/{id}` · `DELETE /api/public/feedback/{id}`
- `X-Api-Key` middleware (constant-time comparison), per-key fixed-window rate limiting (default 60 req/min, configurable), 429/401 in the standard error envelope
- Documented at `/swagger` (OpenAPI JSON at `/swagger/v1/swagger.json`)

### Platform & UX — *owners: zsaleh, oshawish*
- Full i18n: English, Arabic, French — per-page translation modules, language switcher, cookie-persisted, server-rendered `<html lang/dir>`
- Complete RTL support for Arabic (mirrored layout, Cairo font, RTL-aware animations)
- Dark/light themes, mobile tab bar, fully responsive (safe-area, container queries)
- Custom design system: 35 reusable `G*` components, unified palette/typography (Chakra Petch + Cairo), focus-ring tokens
- Accessibility: ARIA roles/labels, focus-trapped modals, keyboard-navigable menus/tabs, `prefers-reduced-motion` support
- Real Privacy Policy + Terms of Service pages (linked from the register form consent, user menu, and cross-linked), translated into all 3 languages
- `/health` status page + `/api/health` backend health check

---

## Modules

> **Mandatory target: 14 points.** Arena 404 implements **14 mandatory points** (7 major modules), plus **extra modules** beyond that — extras are listed in the *Bonus* table (subject caps bonus at +5 validated points).

### Mandatory (14 pts)

| # | Module (category) | Type | Pts | How it's implemented | Owner(s) |
|---|---|---|---|---|---|
| 1 | Use a framework for frontend **and** backend (Web) | Major | 2 | Next.js 16 (React) frontend + ASP.NET Core 10 backend | lalhindi, oissa |
| 2 | Real-time features via WebSockets (Web) | Major | 2 | SignalR `GameHub` (game state, invites, play-again) + `SocialHub` (chat, presence, notifications); automatic reconnect, graceful disconnect handling | lalhindi |
| 3 | User interaction (Web) | Major | 2 | Chat (send/receive private messages), profiles (view any user), friends (add/remove/list) | oissa, oshawish |
| 4 | Standard user management & authentication (User Mgmt) | Major | 2 | Secure signup/login (hashed+salted passwords, OTP email verification), profile update, avatar upload with default fallback, friends with live online status, public profile pages | oissa, zsaleh |
| 5 | Web-based game (Gaming & UX) | Major | 2 | 5 complete real-time games with clear rules and win/loss conditions, played live in the browser | lalhindi, hamza |
| 6 | Remote players (Gaming & UX) | Major | 2 | Two players on separate machines play over the network; server-authoritative state sync, 30s reconnection grace, bot substitution on dropout | lalhindi |
| 7 | AI opponent (AI) | Major | 2 | Per-game bots with 3 selectable difficulty levels: Tic-Tac-Toe (random / 50-50 mix / perfect minimax), Pong (chases ball / linear prediction / wall-bounce-accurate prediction with scaled paddle speed), Snake (safe-random / greedy heuristic / greedy + flood-fill escape analysis), Rock-Paper-Scissors (random / counters your last throw / counters your most frequent throw — never peeks at the hidden choice), Connect Four (random / win-or-block tactics / depth-5 alpha-beta minimax); human-like move delays scale with difficulty | lalhindi |

### Bonus (implemented beyond 14 pts — subject validation cap: +5 pts)

| # | Module (category) | Type | Pts | How it's implemented | Owner(s) |
|---|---|---|---|---|---|
| 8 | Public API (Web) | Major | 2 | API-key middleware (constant-time compare), per-key rate limiting, Swagger docs, 5 endpoints covering GET/POST/PUT/DELETE over real persisted data | lalhindi |
| 9 | Advanced permissions system (User Mgmt) | Major | 2 | 4 roles (User/Moderator/Admin/SuperAdmin); view, role-change, ban, delete users; server-side hierarchy checks; role-gated admin UI | oissa, hamza |
| 10 | Additional games + matchmaking + history (Gaming & UX) | Major | 2 | Beyond the first game, 4 more distinct games — all wired into the same matchmaking queue and match-history/rank pipeline | lalhindi, hamza |
| 11 | ORM for the database (Web) | Minor | 1 | Entity Framework Core 10 (+ Npgsql), 16 versioned migrations | oissa |
| 12 | Custom design system (Web) | Minor | 1 | 35 reusable components, defined color palette, typography and iconography | zsaleh |
| 13 | Multiple languages — 3+ (A11y & i18n) | Minor | 1 | Complete en / ar / fr translations, switcher, cookie persistence, SSR-aware | zsaleh |
| 14 | RTL language support (A11y & i18n) | Minor | 1 | Full Arabic RTL: `<html dir="rtl">` server + client, mirrored layout, RTL-aware animations | zsaleh |
| 15 | Advanced chat features (Gaming & UX) | Minor | 1 | Blocking, game invites from chat, chat notifications, profile access from chat, persisted history, typing indicators, read receipts | oissa, oshawish |
| 16 | Game statistics & match history (User Mgmt) | Minor | 1 | Per-user wins/losses/draws/win-rate, rank/level, full match history per game, leaderboard | oissa, hamza |

*Module dependencies from the subject are respected: all gaming/AI/statistics/chat-enhancement modules sit on top of an implemented base game and the base chat/friends system.*

---

## Individual Contributions

> **Shared-workstation workflow:** most of the project was built in live pair-programming sessions on one machine, which is why the Git history is dominated by `lalhindi`'s account (oissa and zsaleh also committed directly). Ownership below is the real, team-agreed split of responsibility.

### `lalhindi` — PM/Scrum Master · Tech Lead · Developer
- Real-time architecture: `GameHub` + `SocialHub`, event bus, presence service
- All 5 game rooms and their AI bots; matchmaking service, reconnection grace, bot substitution
- Docker Compose stack, nginx HTTPS proxy, WebSocket proxying, cert bootstrap
- Public API (middleware, rate limiting, Swagger), health checks
- Final audit coordination: 35 tracked defects triaged and closed
- *Challenges:* eliminating game-room race conditions (single lock per room + payload built under the same lock); SignalR reconnect noise after token expiry (client-side refresh interceptor); sender-echo design to reconcile optimistic chat UI

### `oissa` — Tech Lead · Developer
- Authentication: registration, login, JWT (HttpOnly cookies), rotating refresh tokens (SHA-256 at rest), ban enforcement on login/refresh
- Email verification & password reset (OTP hashing, attempt caps, resend cooldown, enumeration-safe responses), Brevo integration
- Friends, blocks, chat services with validation, persistence and event emission
- Database schema design and EF Core migrations
- *Challenges:* friend re-request flow without PK mutation (transactional delete + reinsert); preventing email enumeration in forgot-password; refresh-token rotation without racey double-use

### `oshawish` — Product Owner · Developer
- Product vision, feature prioritization, backlog; defined which modules to target and their order (game-first, then social, then competition)
- Dashboard & social pages (home, friends, notifications, history) and their UX flows
- Acceptance validation of every module against the subject wording before sign-off
- *Challenges:* keeping scope coherent under the 14-point target (dropped tournament/spectator to protect quality); consistent empty/error/loading states across all pages

### `zsaleh` — Developer
- The 35-component design system (`G*` primitives) with the unified violet palette and typography tokens
- Full i18n architecture (per-page translation modules, cookie + SSR integration) and the 3 language sets
- Arabic RTL: direction switching, mirrored layouts, Cairo font, RTL-safe animations
- Theming (dark/light) system
- *Challenges:* complete RTL mirroring (not just text direction) across every component; cookie ↔ localStorage theme/locale skew on first SSR paint

### `hamza` — Tech Lead · Developer
- Game pages and canvases (input handling: keyboard + drag/touch, 20 Hz Pong rendering), lobby and invite UX
- Admin dashboard (stats cards, filters, ban/role/delete flows with hierarchy-aware UI)
- Leaderboard page and stats visualization conventions (level = ⌊rank⌋ + progress %)
- Code-quality pass on critical frontend paths
- *Challenges:* smooth client rendering against a server-authoritative 50 ms tick; admin moderation UI that correctly reflects the role hierarchy edge cases

---

## Resources

### References
- ft_transcendence subject (v21.2) — 42
- Next.js documentation — https://nextjs.org/docs
- React documentation — https://react.dev
- Tailwind CSS v4 documentation — https://tailwindcss.com/docs
- ASP.NET Core documentation — https://learn.microsoft.com/aspnet/core
- ASP.NET Core SignalR — https://learn.microsoft.com/aspnet/core/signalr
- EF Core + Npgsql — https://learn.microsoft.com/ef/core · https://www.npgsql.org/efcore/
- Rate limiting in ASP.NET Core — https://learn.microsoft.com/aspnet/core/performance/rate-limit
- Swashbuckle / OpenAPI — https://github.com/domaindrivendev/Swashbuckle.AspNetCore
- PostgreSQL 17 documentation — https://www.postgresql.org/docs/17/
- nginx documentation — https://nginx.org/en/docs/
- Docker Compose documentation — https://docs.docker.com/compose/
- MDN Web Docs (WebSocket upgrade, ARIA practices) — https://developer.mozilla.org

### Use of AI
AI assistance was used **exclusively for debugging and code review support**:
- Running a structured code audit that catalogued defects (35 items: security, race conditions, API contracts, UX issues), each of which the team then reproduced, fixed by hand, and verified against the running stack
- Explaining error messages and suggesting diagnostic approaches during development

No feature was blindly generated: every AI-assisted suggestion was reviewed, understood, adapted, and tested by the team before integration, and all team members can explain the code they own.

---

## Known Limitations

- OAuth 2.0, 2FA, tournament system, spectator mode, game customization, and 3D graphics were intentionally **not** implemented (scope choice; the 14-point requirement is met without them)
- Hard difficulty is intentionally strong — on Tic-Tac-Toe the Hard bot plays perfectly (minimax) and can never lose; pick Medium or Easy for a relaxed game
- Bot-only matches are not written to match history and do not affect ranks (only human-vs-human matches persist)
- nginx ships a **self-signed** certificate for `localhost` — browsers show a warning on first visit in development; use a real certificate for public deployment
- Swagger UI is exposed by default (required for evaluation); set `Swagger__Disabled=true` in `.env` for production
- The public API currently exposes the feedback resource (full CRUD); other resources remain behind user authentication

---

*Arena 404 — 42 Amman, ft_transcendence.*
