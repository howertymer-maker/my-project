import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Nevergiveup",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-on-surface">
      <div className="max-w-[640px] mx-auto px-5 py-10">
        <a
          href="/"
          className="inline-flex items-center gap-1 text-primary-fixed hover:text-primary-container transition-colors font-mono text-[12px] uppercase tracking-wider mb-8"
        >
          ← Назад
        </a>

        <h1 className="font-display text-3xl font-extrabold text-on-surface mb-2">
          Политика конфиденциальности
        </h1>
        <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-8">
          Последнее обновление: 14 июля 2026
        </p>

        <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 font-mono text-[13px] text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              1. Какие данные мы собираем
            </h2>
            <p className="mb-2">Мы собираем:</p>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Email и имя — для регистрации и входа</li>
              <li>Прогресс (очки, уровни, привычки, миссии) — для работы приложения</li>
              <li>Посты и комментарии в сообществе — по вашему желанию</li>
              <li>Аватар — если вы его загрузили</li>
              <li>Push-подписки — для отправки уведомлений (по вашему согласию)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              2. Как мы используем данные
            </h2>
            <p>
              Данные используются исключительно для работы приложения:
              отображение прогресса, лента сообщества, уведомления. Мы не
              продаём и не передаём ваши данные третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              3. Где хранятся данные
            </h2>
            <p>
              Данные хранятся в базе данных PostgreSQL (Neon, серверы ЕС).
              Аватары хранятся в базе в виде base64. Файлы cookie используются
              для поддержания сессии входа.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              4. Push-уведомления
            </h2>
            <p>
              Push-уведомления отправляются только если вы включили их в
              настройках. Вы можете отключить их в любой момент. Уведомления
              включают: напоминания о сериях, завершение этапов, лайки и
              комментарии.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              5. Удаление данных
            </h2>
            <p>
              Вы можете удалить свой аккаунт, обратившись в поддержку. После
              удаления все ваши данные (профиль, прогресс, посты, комментарии)
              будут удалены безвозвратно.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              6. Cookies
            </h2>
            <p>
              Мы используем cookies для поддержания сессии входа (NextAuth).
              Cookies не содержат личных данных и удаляются при выходе из
              аккаунта.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              7. Ваши права
            </h2>
            <p>
              Вы имеете право: запросить свои данные, исправить неточности,
              удалить аккаунт. Для этого напишите: support@nevergiveup.app
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              8. Контакты
            </h2>
            <p>
              По вопросам конфиденциальности: support@nevergiveup.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
