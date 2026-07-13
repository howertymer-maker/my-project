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
# База данных (Neon PostgreSQL — уже есть)
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-noisy-boat...neon.tech/neondb?sslmode=require

# NextAuth (сгенерируйте новый секрет)
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

## 3. После деплоя

### Настройте Cron (ежедневные задачи)

Создайте файл `vercel.json` в корне проекта:
```json
{
  "crons": [
    {
      "path": "/api/cron/snapshot?key=YOUR_CRON_SECRET",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/streak-check?key=YOUR_CRON_SECRET",
      "schedule": "0 20 * * *"
    }
  ]
}
```

Или используйте бесплатный [cron-job.org](https://cron-job.org):
1. Создайте аккаунт
2. Добавьте два задания:
   - `https://yourdomain.com/api/cron/snapshot?key=KEY` — каждый день в 00:00
   - `https://yourdomain.com/api/cron/streak-check?key=KEY` — каждый день в 20:00

### Загрузка аватаров

На Vercel файловая система эфемерная — загруженные аватары пропадут.
**Решение:** используйте Vercel Blob Storage или UploadThing:
```bash
bun add @uploadthing/file-upload
```
И замените `/api/avatar` на загрузку в облако.

### Push уведомления

Push уведомления работают на Vercel (Web Push API не требует WebSocket).
VAPID ключи уже настроены в переменных окружения.

## 4. Подключение домена (опционально)

1. В Vercel: Settings → Domains → Add Domain
2. Введите ваш домен (например `nevergiveup.com`)
3. Настройте DNS записи у регистратора домена:
   - Type: `CNAME`
   - Name: `@` или `www`
   - Value: `cname.vercel-dns.com`
4. Обновите `NEXTAUTH_URL` на ваш домен

## 5. Готово! ✅

Ваше приложение доступно по адресу:
- `https://your-project.vercel.app` (бесплатный поддомен Vercel)
- `https://yourdomain.com` (если подключили домен)
