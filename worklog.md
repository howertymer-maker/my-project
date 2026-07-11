# Worklog - Neon Protocol Gamified Self-Improvement App

## Project Overview
Building a gamified self-improvement app "Neon Protocol" based on 4 design screenshots.
- Dark cyberpunk theme with neon accents (cyan primary, lime secondary, purple tertiary, gold)
- Fonts: Sora (headings) + JetBrains Mono (body/data)
- 4 screens: Profile (Профиль), Habits (Привычки), Missions (Миссии), Community (Сообщество)
- Single-page app at `/` route with bottom tab navigation
- Russian language UI
- Prisma + SQLite backend, API routes for data

---
Task ID: 1
Agent: main
Task: Set up Neon Protocol design system (globals.css, fonts, layout, tailwind theme)

Work Log:
- Analyzed 4 screenshots + design_bundle.md to extract the Neon Protocol design system
- Setting up custom globals.css with neon color tokens, glassmorphism, neon glow utilities
- Configuring Sora + JetBrains Mono fonts in layout.tsx
- Establishing design tokens for all screens to use

Stage Summary:
- Created globals.css with full Neon Protocol MD3 color tokens, glassmorphism, neon glow utilities, typography (Sora/JetBrains Mono), animations
- Configured layout.tsx with Sora + JetBrains Mono fonts + Material Symbols stylesheet, dark mode forced, ru locale
- Avatar image generated (public/avatar.png) via image-generation skill — cyberpunk cyber-monk portrait
- Design system ready for all 4 screens

---
Task ID: 2
Agent: main
Task: Create Prisma schema + seed + db push

Work Log:
- Defined schema: User, Attribute, Habit, Mission, MissionLog, Post, Comment, PostLike
- Ran db:push successfully
- Wrote prisma/seed.ts with realistic Russian content: 1 user (Endeavorise Eric, LVL 42), 6 attributes, 6 habits, 7 missions, 4 community posts + comments
- Ran seed — all data inserted
- Disabled verbose query logging in db.ts

---
Task ID: 3
Agent: main
Task: Build API routes

Work Log:
- GET /api/profile — user + 6 attributes + 6-month chart data
- GET/PATCH /api/habits — list + toggle completion
- GET/PATCH /api/missions — list + advance progress
- GET/POST /api/community — list (with filter) + like/comment

---
Task ID: 4
Agent: main
Task: Build main page shell + top bar + bottom nav

Work Log:
- page.tsx: client component with tab state (profile/habits/missions/community), ambient background glows + grid overlay, renders active screen, fixed top bar + bottom nav
- top-bar.tsx: fixed header with avatar mark, brand text, notifications/settings
- bottom-nav.tsx: 4 tabs with neon active state, safe-area bottom padding
- use-api.ts: lightweight fetch hook (no provider needed)

---
Task ID: 5
Agent: main
Task: Build all 4 screens

Work Log:
- profile-screen.tsx: avatar w/ spinning rings + rank badge, XP bar, 6 attribute bars (color-coded), SVG progress chart with gradient fill + grid, 3 stat chips, skeletons
- habits-screen.tsx: title, date nav, filter tabs + streak badge, habit cards (toggle, rewards, streak, week range), weekly overview 7-day grid
- missions-screen.tsx: header panel w/ metrics, horizontally-scrollable category tabs, mission cards (icon, difficulty chip, duration, XP, progress bar, advance button)
- community-screen.tsx: header + new-post button, filter tabs, post cards (avatar initials, author/badge/time, title, expandable body, like/comment/translate, comments thread w/ input)

---
Task ID: 6
Agent: main
Task: Wire up interactivity

Work Log:
- Habit toggle: PATCH /api/habits, optimistic update
- Mission advance: PATCH /api/missions (+10% per click, marks complete at 100%)
- Post like: POST /api/community, optimistic +1
- Post comments: expandable thread, submit via POST, optimistic append
- Read-more expand for long posts
- All verified working via Agent Browser

---
Task ID: 7
Agent: main
Task: Lint + dev server + Agent Browser verification

Work Log:
- ESLint: 0 errors, 1 benign warning (custom font link for Material Symbols in root layout — false positive for app router)
- Dev server running on port 3000, no runtime errors
- Agent Browser verified all 4 tabs render correctly (desktop + mobile 390px)
- Verified interactions: like (156→157), comments expand w/ input, habit toggle (not-done→done), mission progress (64%→74%)
- Mobile view: no overflow, bottom nav not overlapping, all 6 attributes visible
- VLM polish rating: 8/10

Stage Summary:
- App complete and fully functional at / route
- 4 screens: Profile, Habits, Missions, Community — all data-driven from Prisma/SQLite
- Neon Protocol design system faithfully implemented (dark cyberpunk, neon glows, glassmorphism, Sora+JetBrains Mono)
- All core interactions working end-to-end

---
Task ID: 8
Agent: main
Task: Заменить систему XP на систему очков 6 навыков + 7-й навык (Постоянство), прокачиваемый привычками

Work Log:
- Схема Prisma: добавил `points Int` и `source String` ("missions"|"habits") в Attribute; добавил `rewardPoints Int` в Habit; убрал `xpCurrent`/`xpTotal` из User (уровень теперь вычисляется из суммы очков всех навыков: floor(total/1000))
- Seed: 6 навыков получили очки (6800/7400/7700/4600/7200/5800, source=missions); добавлен 7-й навык "Постоянство" (#fbbf24 золото, source=habits, 4200 очк); привычки получили rewardPoints (60-120) вместо старых дробных наград по атрибутам; миссии: поле xp теперь = очки навыку по категории
- API /api/profile: возвращает очки/уровни всех 7 навыков, consistency отдельно, missionSkills отдельно, totalPoints, общий уровень, чарт по очкам
- API /api/habits PATCH: при выполнении привычки +rewardPoints к навыку "consistency"; при отмене −rewardPoints; возвращает обновлённые consistencyPoints
- API /api/missions PATCH: при продвижении +пропорциональные очки (delta/100 * xp) к навыку по категории миссии
- UI Profile: убран глобальный XP-бар; добавлена prominent золотая карточка "Постоянство" с очками/уровнем/прогрессом и подписью "прокачивается привычками"; секция "Навыки" (бывш. "Атрибуты") показывает очки + ур.N для 6 навыков, подпись "прокач. миссиями"; общий уровень вычисляется
- UI Habits: добавлен live-трекер "Постоянство" сверху (обновляется при тогле привычки); награды на карточках = золотой чип "+N очк → Постоянство"
- UI Missions: "+N XP" → "+N очк → <навык>"; метрика "XP награда" → "Очков навыков"
- UI Community: "+N XP" → "+N очк"
- Top-bar: уровень теперь динамический (fetch /api/profile)
- ESLint: 0 ошибок. Dev-сервер работает без runtime-ошибок
- Agent Browser: проверены все 4 экрана — XP нигде нет, Постоянство отображается, очки корректны
- E2E проверка начисления: тогл привычки "Ставить цели с вечера" (+60) → Постоянство 4200→4260 ✓; продвижение физической миссии (+10% от 1200 = +120) → Физика 4600→4720 ✓
- БД пере-seed'нута для чистовых значений

Stage Summary:
- Глобальная система XP полностью удалена
- 6 навыков (Дисциплина/Социальность/Ментал/Физика/Финансы/Внешность) прокачиваются МИССИЯМИ через очки
- 7-й навык "Постоянство" прокачивается ИСКЛЮЧИТЕЛЬНО ПРИВЫЧКАМИ через очки
- 1000 очков = 1 уровень навыка; общий уровень = сумма всех очков / 1000
- Весь флоу начисления очков работает end-to-end и обновляется в реальном времени
