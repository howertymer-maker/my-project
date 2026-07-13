# Nevergiveup — Руководство по деплою на Vercel

## 1. Подготовка

### Загрузите код на GitHub
```bash
git init
git add .
git commit -m "Nevergiveup ready for deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nevergiveup.git
git push -u origin main
```

### Создайте аккаунт Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub

## 2. Деплой

1. Нажмите **"Add New Project"** → выберите репозиторий
2. Framework Preset: **Next.js** (автоопределение)
3. Build Command: `next build` (авто)
4. Output Directory: `.next` (авто)

### Переменные окружения (ОБЯЗАТЕЛЬНО)

Добавьте ВСЕ переменные в Settings → Environment Variables:

```bash
# База данных (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-noisy-boat...neon.tech/neondb?sslmode=require

# NextAuth
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://your-project.vercel.app

# Авторизация (ОБЯЗАТЕЛЬНО false для production!)
NEXT_PUBLIC_AUTH_BYPASS=false

# Cron защита
CRON_SECRET=<случайная строка>

# Push уведомления (VAPID keys)
VAPID_PUBLIC_KEY=BMwktvZbvmVM9bWfV...
VAPID_PRIVATE_KEY=s7BH0T2qwD3y5V...
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BMwktvZbvmVM9bWfV...

# Google Analytics (опционально)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. Нажмите **Deploy** → через 2-3 минуты приложение будет live

## 3. Cron — настройка через cron-job.org (бесплатно)

Vercel free tier ограничен 1 cron job, поэтому используем бесплатный cron-job.org для обоих заданий.

### Шаг 1: Сгенерируйте CRON_SECRET
```bash
openssl rand -hex 16
# например: a3f7b2c8e1d4...
```
Добавьте в Vercel Environment Variables как `CRON_SECRET`.

### Шаг 2: Зарегистрируйтесь на cron-job.org
1. Откройте [cron-job.org](https://cron-job.org)
2. Создайте бесплатный аккаунт

### Шаг 3: Создайте два задания

**Задание 1 — Ежедневный снепшот (для графика прогресса)**
- Title: `Nevergiveup — Snapshot`
- URL: `https://yourdomain.vercel.app/api/cron/snapshot?key=YOUR_CRON_SECRET`
- Execution schedule: Every day, 23:59
- Save

**Задание 2 — Проверка серий под угрозой**
- Title: `Nevergiveup — Streak Check`
- URL: `https://yourdomain.vercel.app/api/cron/streak-check?key=YOUR_CRON_SECRET`
- Execution schedule: Every day, 20:00
- Save

Готово! Cron будет автоматически запускаться каждый день.

## 4. Что уже работает на Vercel из коробки

| Функция | Статус | Как |
|---------|--------|-----|
| Next.js SSR | ✅ | Родная поддержка |
| PostgreSQL (Neon) | ✅ | Внешняя БД |
| CDN (статика) | ✅ | Авто, глобальный Edge CDN |
| PWA (manifest + SW) | ✅ | Статичные файлы |
| Push уведомления | ✅ | Web Push API, без WebSocket |
| Аватары | ✅ | Хранятся в БД как base64 |
| Sitemap/robots.txt | ✅ | Next.js metadata routes |
| Rate limiting | ✅ | In-memory middleware |
| Google Analytics | ✅ | Scaffold, добавьте GA_ID |
| Cron | ✅ | Через cron-job.org |
| SEO (meta tags) | ✅ | OpenGraph + sitemap |

## 5. Подключение домена (опционально)

1. В Vercel: Settings → Domains → Add Domain
2. Введите ваш домен (например `nevergiveup.com`)
3. Настройте DNS записи у регистратора домена:
   - Type: `CNAME`
   - Name: `@` или `www`
   - Value: `cname.vercel-dns.com`
4. Обновите `NEXTAUTH_URL` на ваш домен

## 6. Готово! ✅

Ваше приложение доступно по адресу:
- `https://your-project.vercel.app` (бесплатный поддомен Vercel)
- `https://yourdomain.com` (если подключили домен)
