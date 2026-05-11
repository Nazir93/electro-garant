"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { ChevronDown, ChevronRight, FileUp, Save } from "lucide-react";
import type { PriceCalculatorItemDTO, PriceCalculatorSectionDTO } from "@/lib/price-calculator-types";

type RowEdit = {
  price: string;
  pdfLine: string;
  unit: string;
  name: string;
};

type PriceListInfo = {
  downloadName: string;
  href: string;
  fileExists: boolean;
  fileSize: number;
  updatedAt: string | null;
};

export default function AdminPriceCalculatorPage() {
  const [sections, setSections] = useState<PriceCalculatorSectionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [edits, setEdits] = useState<Record<string, RowEdit>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const [priceList, setPriceList] = useState<PriceListInfo | null>(null);
  const [downloadNameEdit, setDownloadNameEdit] = useState("");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [savingPdfName, setSavingPdfName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/price-calculator")
      .then((r) => r.json())
      .then((d: { sections?: PriceCalculatorSectionDTO[]; error?: string }) => {
        if (d.error || !d.sections) {
          setSections([]);
          return;
        }
        setSections(d.sections);
        const next: Record<string, RowEdit> = {};
        for (const s of d.sections) {
          for (const i of s.items) {
            next[i.id] = {
              price: i.price != null ? String(i.price) : "",
              pdfLine: i.pdfLine != null ? String(i.pdfLine) : "",
              unit: i.unit || "",
              name: i.name || "",
            };
          }
        }
        setEdits(next);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadPriceList = useCallback(() => {
    fetch("/api/admin/price-list")
      .then((r) => r.json())
      .then((d: PriceListInfo & { error?: string }) => {
        if (!d.error && d.href) {
          setPriceList(d);
          setDownloadNameEdit(d.downloadName);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    loadPriceList();
  }, [load, loadPriceList]);

  async function savePdfDownloadName() {
    setSavingPdfName(true);
    try {
      const res = await fetch("/api/admin/price-list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadName: downloadNameEdit }),
      });
      if (!res.ok) throw new Error();
      await loadPriceList();
    } catch {
      alert("Не удалось сохранить имя файла");
    } finally {
      setSavingPdfName(false);
    }
  }

  async function onPdfSelected(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    setUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("downloadName", downloadNameEdit.trim());
      const res = await fetch("/api/admin/price-list", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(typeof data.error === "string" ? data.error : "Ошибка загрузки PDF");
        return;
      }
      await loadPriceList();
    } catch {
      alert("Ошибка загрузки PDF");
    } finally {
      setUploadingPdf(false);
    }
  }

  function setField(id: string, field: keyof RowEdit, value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function saveRow(item: PriceCalculatorItemDTO) {
    const e = edits[item.id];
    if (!e) return;
    setSavingId(item.id);
    try {
      const priceRaw = e.price.trim();
      const price =
        priceRaw === "" ? null : Number(priceRaw.replace(",", "."));
      if (price != null && !Number.isFinite(price)) {
        alert("Некорректная цена");
        return;
      }
      const pl = e.pdfLine.trim();
      const pdfLine = pl === "" ? null : parseInt(pl, 10);
      if (pdfLine != null && !Number.isFinite(pdfLine)) {
        alert("Некорректный № строки");
        return;
      }

      const res = await fetch(`/api/admin/price-calculator/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: e.name,
          unit: e.unit,
          price,
          pdfLine,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as PriceCalculatorItemDTO;
      setSections((prev) =>
        prev.map((sec) => ({
          ...sec,
          items: sec.items.map((it) =>
            it.id === updated.id
              ? {
                  ...it,
                  name: updated.name,
                  unit: updated.unit,
                  price: updated.price,
                  pdfLine: updated.pdfLine,
                }
              : it
          ),
        }))
      );
      setEdits((prev) => ({
        ...prev,
        [item.id]: {
          price: updated.price != null ? String(updated.price) : "",
          pdfLine: updated.pdfLine != null ? String(updated.pdfLine) : "",
          unit: updated.unit || "",
          name: updated.name || "",
        },
      }));
    } catch {
      alert("Ошибка сохранения");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-white/30">Загрузка прайса…</div>;
  }

  const fmtSize = (n: number) => {
    if (n < 1024) return `${n} Б`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} КБ`;
    return `${(n / 1024 / 1024).toFixed(2)} МБ`;
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Прайс калькулятора сметы</h1>
        <p className="text-sm text-white/40 mt-1">
          Цены и названия совпадают с PDF для посетителей на странице /price. После правок обновите страницу сайта.
        </p>
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">PDF для кнопки «Скачать прайс»</h2>
            <p className="text-xs text-white/40 mt-1 max-w-xl">
              Файл сохраняется как <code className="text-[#C9A84C]">/price-list.pdf</code> — стабильная ссылка на сайте.
              Имя при скачивании можно задать ниже (кириллица и скобки допустимы).
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={onPdfSelected}
          />
          <button
            type="button"
            disabled={uploadingPdf}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A84C] hover:bg-[#B8933F] disabled:opacity-50 text-black text-sm font-semibold"
          >
            <FileUp size={18} />
            {uploadingPdf ? "Загрузка…" : "Загрузить PDF"}
          </button>
        </div>
        {priceList && (
          <div className="text-xs text-white/45 space-y-1 font-mono">
            <p>
              URL: <span className="text-white/70">{priceList.href}</span>
            </p>
            <p>
              Файл на сервере:{" "}
              {priceList.fileExists ? (
                <>
                  да, {fmtSize(priceList.fileSize)}
                  {priceList.updatedAt ? `, обновлён ${new Date(priceList.updatedAt).toLocaleString("ru-RU")}` : ""}
                </>
              ) : (
                "нет — загрузите PDF или скопируйте файл в public/price-list.pdf"
              )}
            </p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end max-w-xl">
          <label className="flex-1 space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-white/35">Имя при скачивании</span>
            <input
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm"
              value={downloadNameEdit}
              onChange={(e) => setDownloadNameEdit(e.target.value)}
              placeholder="Прайс ГМ 25-26(для пересылки).pdf"
            />
          </label>
          <button
            type="button"
            disabled={savingPdfName || !priceList || downloadNameEdit.trim() === priceList.downloadName}
            onClick={() => savePdfDownloadName()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/[0.06] disabled:opacity-40 text-sm"
          >
            <Save size={16} />
            Сохранить имя
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/50">
          В базе нет позиций калькулятора. Выполните миграцию{" "}
          <code className="text-[#C9A84C]">npx prisma migrate deploy</code> и загрузите прайс:{" "}
          <code className="text-[#C9A84C]">npm run db:seed-price</code>
        </div>
      ) : null}

      {sections.map((sec) => (
        <div key={sec.id} className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden">
          <button
            type="button"
            onClick={() =>
              setExpanded((x) => ({ ...x, [sec.id]: !x[sec.id] }))
            }
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04]"
          >
            {expanded[sec.id] ? <ChevronDown size={18} className="text-[#C9A84C]" /> : <ChevronRight size={18} className="text-white/30" />}
            <span className="font-semibold">{sec.title}</span>
            <span className="text-xs text-white/35">{sec.items.filter((i) => !i.isHeading).length} поз.</span>
          </button>

          {expanded[sec.id] && (
            <div className="border-t border-white/[0.06] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-white/35 border-b border-white/[0.06]">
                    <th className="px-3 py-2 w-14">№ PDF</th>
                    <th className="px-3 py-2 min-w-[200px]">Наименование</th>
                    <th className="px-3 py-2 w-24">Ед.</th>
                    <th className="px-3 py-2 w-28">Цена</th>
                    <th className="px-3 py-2 w-28">Ключ автозаполнения</th>
                    <th className="px-3 py-2 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {sec.items.map((item) => {
                    const e = edits[item.id];
                    if (item.isHeading) {
                      return (
                        <tr key={item.id} className="bg-[#C9A84C]/10">
                          <td colSpan={6} className="px-3 py-2 text-xs font-semibold text-[#C9A84C]">
                            {item.pdfLine != null ? `${item.pdfLine}. ` : ""}
                            {item.name}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-3 py-2 align-top">
                          <input
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs tabular-nums"
                            value={e?.pdfLine ?? ""}
                            onChange={(ev) => setField(item.id, "pdfLine", ev.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <textarea
                            rows={2}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs leading-snug resize-y min-h-[44px]"
                            value={e?.name ?? ""}
                            onChange={(ev) => setField(item.id, "name", ev.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <input
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs"
                            value={e?.unit ?? ""}
                            onChange={(ev) => setField(item.id, "unit", ev.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2 align-top">
                          <input
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs tabular-nums"
                            value={e?.price ?? ""}
                            onChange={(ev) => setField(item.id, "price", ev.target.value)}
                            placeholder="пусто = договор"
                          />
                        </td>
                        <td className="px-3 py-2 align-top text-[11px] text-white/40 font-mono">
                          {item.fillKey ?? "—"}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <button
                            type="button"
                            disabled={savingId === item.id}
                            onClick={() => saveRow(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C9A84C] hover:bg-[#B8933F] disabled:opacity-50 text-black text-xs font-semibold"
                          >
                            <Save size={14} />
                            Сохранить
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
