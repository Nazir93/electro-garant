import { prisma } from "@/lib/db";
import { createDefaultContactConfig, type ContactConfig } from "@/lib/contact-config";

const KEYS = [
  "phone",
  "phone_raw",
  "phone2",
  "phone2_raw",
  "email",
  "address",
  "working_hours",
  "social_telegram",
  "social_max",
  "price_list_download_name",
] as const;

/** Подмешивает значения из siteSettings поверх дефолтов из constants. */
export async function loadContactConfig(): Promise<ContactConfig> {
  const d = createDefaultContactConfig();
  try {
    const rows = await prisma.siteSettings.findMany({
      where: { key: { in: [...KEYS] } },
    });
    const m = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
    if (m.phone?.trim()) d.phone = m.phone.trim();
    if (m.phone_raw?.trim()) d.phoneRaw = m.phone_raw.trim();
    if (m.phone2?.trim()) d.phone2 = m.phone2.trim();
    if (m.phone2_raw?.trim()) d.phone2Raw = m.phone2_raw.trim();
    if (m.email?.trim()) d.email = m.email.trim();
    if (m.address?.trim()) d.address = m.address.trim();
    if (m.working_hours?.trim()) d.workingHours = m.working_hours.trim();
    if (m.social_telegram?.trim()) d.social.telegram = m.social_telegram.trim();
    if (m.social_max?.trim()) d.social.max = m.social_max.trim();
    if (m.price_list_download_name?.trim()) {
      d.priceListDownloadName = m.price_list_download_name.trim();
    }
  } catch {
    /* БД недоступна — дефолты */
  }
  return d;
}
