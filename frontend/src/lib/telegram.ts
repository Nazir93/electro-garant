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

export function formatLeadMessage(lead: {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  source?: string | null;
  pageUrl?: string | null;
}) {
  const lines = [
    `<b>Новая заявка</b>`,
    ``,
    `<b>Имя:</b> ${lead.name}`,
    `<b>Телефон:</b> ${lead.phone}`,
  ];

  if (lead.email) lines.push(`<b>Email:</b> ${lead.email}`);
  if (lead.service) lines.push(`<b>Услуга:</b> ${lead.service}`);
  if (lead.source) lines.push(`<b>Источник:</b> ${lead.source}`);
  if (lead.pageUrl) lines.push(`<b>Страница:</b> ${lead.pageUrl}`);

  return lines.join("\n");
}
