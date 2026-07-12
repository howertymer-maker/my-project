# Nevergiveup — Руководство по деплою

## Переменные окружения (.env)

```bash
# База данных (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# NextAuth (ОБЯЗАТЕЛЬНО заменить на случайную строку)
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# Авторизация (false = включить вход/регистрацию)
NEXT_PUBLIC_AUTH_BYPASS=false

# Cron (защита API /api/cron/streak-check)
CRON_SECRET=<случайная строка>

# Google Analytics (опционально)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry — ошибка логирования (опционально)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Push notifications (VAPID keys — сгенерировать: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=<public key>
VAPID_PRIVATE_KEY=<private key>
```

## CDN

CDN включается **автоматически** на большинстве хостингов:
- **Vercel** — глобальный Edge CDN из коробки, статика кэшируется автоматически
- **Netlify** — аналогично, CDN на всех планах
- **Cloudflare** — можно поставить перед любым хостингом как reverse proxy

Ничего настраивать в коде не нужно — Next.js уже отдаёт статику с правильными
`Cache-Control` заголовками через `/_next/static/`.

## Cron — «серия под угрозой»

API: `GET /api/cron/streak-check?key=YOUR_CRON_SECRET`

Настройте внешний cron на **ежедневный запуск в 20:00**:

### Vercel Cron
Создайте `vercel.json`:
```json
{
  "crons": [{ "path": "/api/cron/streak-check?key=YOUR_KEY", "schedule": "0 20 * * *" }]
}
```

### cron-job.org (бесплатно)
1. Зарегистрируйтесь на cron-job.org
2. URL: `https://yourdomain.com/api/cron/streak-check?key=YOUR_KEY`
3. Schedule: каждый день в 20:00

## Push-уведомления

1. Сгенерируйте VAPID ключи: `npx web-push generate-vapid-keys`
2. Добавьте в `.env`: `VAPID_PUBLIC_KEY` и `VAPID_PRIVATE_KEY`
3. Пользователи подписываются через Settings → Push-уведомления
4. При создании notification в БД — сервер отправляет push через Web Push API

## Realtime (WebSocket)

Mini-service на порту 3003:
```bash
cd mini-services/realtime && bun install && bun run dev
```

Frontend подключается через: `io("/?XTransformPort=3003")`
События: `post:new`, `post:like`, `post:comment`, `notification`

## Sentry

```bash
bun add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
# Укажите SENTRY_DSN в .env
```
