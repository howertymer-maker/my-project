import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Условия использования — Nevergiveup",
};

export default function TermsPage() {
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
          Условия использования
        </h1>
        <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider mb-8">
          Последнее обновление: 14 июля 2026
        </p>

        <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 font-mono text-[13px] text-on-surface-variant leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              1. Общие положения
            </h2>
            <p>
              Nevergiveup — геймифицированная платформа саморазвития. Используя
              приложение, вы соглашаетесь с настоящими условиями. Если вы не
              согласны — прекратите использование сервиса.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              2. Аккаунт пользователя
            </h2>
            <p>
              Вы несёте ответственность за сохранность своих учётных данных и за
              все действия под вашим аккаунтом. Запрещается передавать аккаунт
              третьим лицам.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              3. Контент
            </h2>
            <p>
              Вы несёте ответственность за контент, который публикуете в
              сообществе. Запрещается: спам, оскорбления, незаконный контент,
              реклама без согласования. Администрация вправе удалить любой контент.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              4. Премиум-подписка
            </h2>
            <p>
              Премиум-подписка открывает доступ ко всем миссиям и убирает
              кулдауны. Управление подпиской доступно в настройках. Подписка
              может быть отключена в любой момент.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              5. Ответственность
            </h2>
            <p>
              Сервис предоставляется «как есть». Администрация не гарантирует
              бесперебойную работу и не несёт ответственности за возможные
              сбои. Приложение не является медицинским или психологическим
              сервисом.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              6. Изменения условий
            </h2>
            <p>
              Администрация вправе изменять настоящие условия. Актуальная версия
              всегда доступна на этой странице.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-on-surface mb-2">
              7. Контакты
            </h2>
            <p>
              По вопросам использования сервиса: support@nevergiveup.app
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
