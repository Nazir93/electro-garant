export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
  } catch (error) {
    console.error("[TELEGRAM] Failed to send notification:", error);
  }
}

type PriceSmetaCalc = {
  kind?: string;
  withVat?: boolean;
  total?: number;
  positionCount?: number;
  lines?: Array<{
    name: string;
    qty: number;
    lineTotal: number;
    sectionTitle?: string;
    unit?: string;
  }>;
};

function normalizeCalcData(raw: unknown): unknown {
  if (raw == null) return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

export function formatLeadMessage(lead: {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  source?: string | null;
  pageUrl?: string | null;
  calcData?: unknown;
}) {
  const lines = [
    `<b>Новая заявка</b>`,
    ``,
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
  ];

  if (lead.email) lines.push(`<b>Email:</b> ${escapeHtml(lead.email)}`);
  if (lead.service) lines.push(`<b>Услуга:</b> ${escapeHtml(lead.service)}`);
  if (lead.source) lines.push(`<b>Источник:</b> ${escapeHtml(lead.source)}`);
  if (lead.pageUrl) lines.push(`<b>Страница:</b> ${lead.pageUrl}`);

  const rawCalc = normalizeCalcData(lead.calcData);
  if (
    rawCalc &&
    typeof rawCalc === "object" &&
    "kind" in rawCalc &&
    (rawCalc as { kind?: string }).kind === "offer-pizza" &&
    "comment" in rawCalc &&
    typeof (rawCalc as { comment: unknown }).comment === "string"
  ) {
    const p = rawCalc as { comment: string; previousLeadId?: string };
    lines.push(``, `<b>Пожелание по пицце (оффер)</b>`);
    lines.push(escapeHtml(p.comment.slice(0, 2000)));
    if (p.previousLeadId) {
      lines.push(`<i>Первая заявка: ${escapeHtml(p.previousLeadId)}</i>`);
    }
  }

  if (
    rawCalc &&
    typeof rawCalc === "object" &&
    "kind" in rawCalc &&
    rawCalc.kind === "partner-feedback" &&
    "message" in rawCalc &&
    typeof (rawCalc as { message: unknown }).message === "string"
  ) {
    const partner = rawCalc as { kind: string; topic?: string; message: string };
    lines.push(``, `<b>Партнёрская заявка</b>`);
    if (partner.topic) lines.push(`<b>Тема:</b> ${escapeHtml(partner.topic)}`);
    lines.push(`<b>Сообщение:</b> ${escapeHtml(partner.message.slice(0, 2000))}`);
  }

  const smeta = rawCalc as PriceSmetaCalc | null | undefined;
  if (smeta?.kind === "price-smeta" && Array.isArray(smeta.lines)) {
    lines.push(``, `<b>Смета (калькулятор прайса)</b>`);
    const nds = smeta.withVat ? "с НДС 22%" : "без НДС";
    lines.push(`<b>Итого:</b> ${(smeta.total ?? 0).toLocaleString("ru-RU")} ₽ (${nds})`);
    lines.push(`<b>Позиций:</b> ${smeta.positionCount ?? smeta.lines.length}`);
    const max = 30;
    smeta.lines.slice(0, max).forEach((row, i) => {
      const title = row.sectionTitle ? `${row.sectionTitle}: ` : "";
      const name = (row.name || "").slice(0, 120);
      const u = row.unit ? ` ${escapeHtml(row.unit)}` : "";
      lines.push(
        `${i + 1}. ${escapeHtml(title)}${escapeHtml(name)} — ${row.qty}${u} → ${(row.lineTotal ?? 0).toLocaleString("ru-RU")} ₽`
      );
    });
    if (smeta.lines.length > max) {
      lines.push(`… и ещё <b>${smeta.lines.length - max}</b> поз. (полный список в админке / БД)`);
    }
  }

  return lines.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
