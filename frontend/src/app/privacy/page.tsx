import type { Metadata } from "next";
import { SITE_NAME, EMAIL, PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand mb-8">
          Политика конфиденциальности
        </h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
          <p>
            Настоящая политика конфиденциальности определяет порядок обработки и
            защиты персональных данных пользователей сайта компании {SITE_NAME}.
          </p>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            1. Сбор информации
          </h2>
          <p>
            Мы собираем информацию, которую вы предоставляете при заполнении форм
            на сайте: имя, номер телефона, адрес электронной почты. Данные
            собираются исключительно с вашего согласия при отправке формы.
          </p>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            2. Использование информации
          </h2>
          <p>Собранная информация используется для:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Связи с вами по вашему запросу</li>
            <li>Предоставления консультации по услугам</li>
            <li>Подготовки коммерческого предложения</li>
            <li>Улучшения качества обслуживания</li>
          </ul>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            3. Защита данных
          </h2>
          <p>
            Мы принимаем все необходимые меры для защиты ваших персональных данных
            от несанкционированного доступа, изменения, раскрытия или уничтожения.
            Передача данных осуществляется по защищённому протоколу HTTPS.
          </p>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            4. Передача третьим лицам
          </h2>
          <p>
            Мы не передаём ваши персональные данные третьим лицам, за исключением
            случаев, предусмотренных законодательством Российской Федерации.
          </p>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            5. Файлы cookie
          </h2>
          <p>
            Сайт может использовать файлы cookie для аналитики (Яндекс.Метрика,
            Google Analytics). Вы можете отключить cookie в настройках браузера.
          </p>

          <h2 className="text-xl font-heading font-bold text-brand mt-8 mb-3">
            6. Контакты
          </h2>
          <p>
            По вопросам обработки персональных данных обращайтесь:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email: {EMAIL}</li>
            <li>Телефон: {PHONE}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
