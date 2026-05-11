import {
  PHONE,
  PHONE_RAW,
  PHONE2,
  PHONE2_RAW,
  EMAIL,
  ADDRESS,
  WORKING_HOURS,
  SOCIAL_LINKS,
  PRICE_LIST_HREF,
  PRICE_LIST_DOWNLOAD_NAME_DEFAULT,
} from "@/lib/constants";

/** Контакты и соцсети для UI (дефолты из кода, при наличии — подмена из БД в loadContactConfig). */
export type ContactConfig = {
  phone: string;
  phoneRaw: string;
  phone2: string;
  phone2Raw: string;
  email: string;
  address: string;
  workingHours: string;
  /** Ссылка на PDF прайса в public (фиксированное имя файла). */
  priceListHref: string;
  /** Имя файла для атрибута download у кнопок «Скачать прайс». */
  priceListDownloadName: string;
  social: {
    telegram: string;
    max: string;
  };
};

export function createDefaultContactConfig(): ContactConfig {
  return {
    phone: PHONE,
    phoneRaw: PHONE_RAW,
    phone2: PHONE2,
    phone2Raw: PHONE2_RAW,
    email: EMAIL,
    address: ADDRESS,
    workingHours: WORKING_HOURS,
    priceListHref: PRICE_LIST_HREF,
    priceListDownloadName: PRICE_LIST_DOWNLOAD_NAME_DEFAULT,
    social: {
      telegram: SOCIAL_LINKS.telegram,
      max: SOCIAL_LINKS.max,
    },
  };
}

/** Часы работы офиса для schema.org — синхронно с WORKING_HOURS в constants (9–17 пн–пт). */
export const OFFICE_OPENING_HOURS_JSON_LD = {
  "@type": "OpeningHoursSpecification" as const,
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
  opens: "09:00",
  closes: "17:00",
};
