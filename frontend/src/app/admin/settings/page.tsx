"use client";

import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";

const SETTINGS_GROUPS = [
  {
    title: "Общие",
    fields: [
      { key: "site_name", label: "Название компании", placeholder: "Гарант Монтаж" },
      { key: "site_description", label: "Описание сайта", placeholder: "Электромонтаж премиум-класса", multiline: true },
      { key: "city", label: "Город", placeholder: "Сочи" },
    ],
  },
  {
    title: "Контакты",
    fields: [
      { key: "phone", label: "Телефон", placeholder: "8 (928) 455-455-9" },
      { key: "phone_raw", label: "Телефон (для ссылки)", placeholder: "89284554559" },
      { key: "email", label: "Email", placeholder: "garantmontaj@gmail.com" },
      { key: "address", label: "Адрес", placeholder: "Краснодарский край, г. Сочи, ..." },
      { key: "working_hours", label: "Режим работы", placeholder: "Пн–Пт 09:00–18:00" },
    ],
  },
  {
    title: "Соцсети",
    fields: [
      { key: "social_telegram", label: "Telegram", placeholder: "https://t.me/..." },
      { key: "social_whatsapp", label: "WhatsApp", placeholder: "https://wa.me/..." },
      { key: "social_vk", label: "VK", placeholder: "https://vk.com/..." },
    ],
  },
  {
    title: "Реквизиты",
    fields: [
      { key: "company_full_name", label: "Полное наименование", placeholder: "ИП ...", multiline: true },
      { key: "company_short_name", label: "Краткое наименование", placeholder: "ИП ..." },
      { key: "company_inn", label: "ИНН", placeholder: "000000000000" },
      { key: "company_ogrnip", label: "ОГРНИП", placeholder: "000000000000000" },
      { key: "company_postal_address", label: "Почтовый адрес", placeholder: "354068, ..." },
      { key: "bank_name", label: "Банк", placeholder: "АО \"Тинькофф Банк\"" },
      { key: "bank_account", label: "Р/с", placeholder: "40802810700003133044" },
      { key: "bank_corr_account", label: "К/с", placeholder: "30101810145250000974" },
      { key: "bank_bic", label: "БИК", placeholder: "044525974" },
    ],
  },
  {
    title: "Аналитика",
    fields: [
      { key: "yandex_metrika_id", label: "ID Яндекс.Метрики", placeholder: "12345678" },
      { key: "google_analytics_id", label: "ID Google Analytics", placeholder: "G-XXXXXXXXXX" },
    ],
  },
  {
    title: "Telegram-уведомления",
    fields: [
      { key: "telegram_bot_token", label: "Bot Token", placeholder: "123456:ABC-DEF..." },
      { key: "telegram_chat_id", label: "Chat ID", placeholder: "-100123456789" },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Не удалось загрузить настройки");
        } else {
          setSettings(data);
        }
      })
      .catch(() => setError("Ошибка подключения к БД"))
      .finally(() => setLoading(false));
  }, []);

  function updateField(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-white/30">Загрузка настроек...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
          <p className="text-sm text-white/40 mt-1">Общие настройки сайта</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? "bg-green-500 text-black"
              : "bg-[#C9A84C] hover:bg-[#B8933F] text-black"
          } disabled:opacity-50`}
        >
          <Save size={16} />
          {saving ? "Сохранение..." : saved ? "Сохранено" : "Сохранить"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {SETTINGS_GROUPS.map((group) => (
        <div key={group.title} className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{group.title}</h2>
          <div className="space-y-3">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-white/40 mb-1 tracking-wide">{field.label}</label>
                {"multiline" in field && field.multiline ? (
                  <textarea
                    value={settings[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] || ""}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
