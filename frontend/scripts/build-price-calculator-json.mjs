/**
 * Собирает JSON для сидера прайса из текста pdf-parse (scripts/pdf-price-raw.txt).
 *
 * Важно: строки PDF без ведущего номера, но с полной ценой в конце — отдельные позиции
 * (иначе склеиваются с предыдущей строкой — типичная жалоба заказчика).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawPath = path.join(__dirname, "pdf-price-raw.txt");
const outPath = path.join(__dirname, "..", "src", "data", "price-calculator-generated.json");

const text = fs.readFileSync(rawPath, "utf8");
const lines = text.split(/\r?\n/);

const skipLine = (s) =>
  !s.trim() ||
  /^-- \d+ of \d+ --$/.test(s.trim()) ||
  /^№ Наименование/.test(s) ||
  /^Актуальные цены/.test(s) ||
  /^С Уважением/.test(s) ||
  /^Владимир/.test(s) ||
  /^\+\d/.test(s.trim()) ||
  /^gmont\.ru$/i.test(s.trim());

/** Цена в конце строки */
function parsePriceFromLine(s) {
  const t = s.trim().replace(/\s+/g, " ");
  const m = t.match(/([\d\s]+,\d{2})\s*$/);
  if (m) return parseFloat(m[1].replace(/\s/g, "").replace(",", "."));
  const m2 = t.match(/\s(\d{1,6})\s*$/);
  if (m2) return parseFloat(m2[1], 10);
  return null;
}

function stripTrailingPrice(s) {
  const t = s.trim();
  const m = t.match(/^(.+?)\s+([\d\s]+,\d{2})\s*$/);
  if (m) return m[1].trim();
  const m2 = t.match(/^(.+?)\s+(\d{1,6})\s*$/);
  if (m2 && !/^\d+$/.test(m2[1].trim())) return m2[1].trim();
  return t;
}

/** Уже есть полная цена в конце буфера (можно начинать новую позицию) */
function endsWithCompletePrice(s) {
  const t = s.trim();
  if (!t) return false;
  if (/[\d\s]+,\d{2}\s*$/.test(t)) return true;
  // «жила 80», «коэф.» без копеек
  if (/\sжила\s+\d{1,6}\s*$/i.test(t)) return true;
  return false;
}

function splitNameUnit(restNoPrice) {
  const t = restNoPrice.trim().replace(/\s+/g, " ");
  const units =
    /(шт\/пог\.м|шт\/п\.м|м2|м\.п\.|м\.п|мп|п\.м\.|п\.м|группа\.|проц\.|коэф\.|услуга|точка|жила|модуль\.|м\.|м\s|шт\.|шт)$/i;
  const um = t.match(new RegExp(`^(.+?)\\s+(${units.source})\\s*$`, "i"));
  if (um) {
    return { name: um[1].trim(), unit: um[2].replace(/\.$/, "").trim() };
  }
  return { name: t, unit: "—" };
}

/** Строка без номера PDF, но самодостаточная позиция (название + ед. + цена) */
function parseStandalonePricedRow(trimmed) {
  const price = parsePriceFromLine(trimmed);
  if (price == null) return null;
  const body = stripTrailingPrice(trimmed);
  if (!body || body.length < 4) return null;
  const { name, unit } = splitNameUnit(body);
  return { pdfLine: null, name, unit, price };
}

const records = [];
let curNum = null;
let curText = "";

function flushRecord() {
  if (curNum == null) return;
  const full = curText.replace(/\s+/g, " ").trim();
  if (!full) {
    curNum = null;
    curText = "";
    return;
  }
  const price = parsePriceFromLine(full);
  const body = price != null ? stripTrailingPrice(full) : full;
  const { name, unit } = splitNameUnit(body);
  records.push({
    pdfLine: parseInt(curNum, 10),
    name,
    unit,
    price: price ?? null,
  });
  curNum = null;
  curText = "";
}

for (const line of lines) {
  if (skipLine(line)) continue;
  const trimmed = line.trim();
  const onlyNum = trimmed.match(/^(\d+)$/);
  const numbered = trimmed.match(/^(\d+)\s+(.+)$/);

  /** Строка без номера */
  if (!onlyNum && !numbered && trimmed) {
    if (curNum != null && endsWithCompletePrice(curText)) {
      flushRecord();
    }
    const orphan = parseStandalonePricedRow(trimmed);
    if (orphan && curNum == null) {
      records.push(orphan);
      continue;
    }
    if (curNum != null) {
      curText += " " + trimmed;
      continue;
    }
    continue;
  }

  if (onlyNum) {
    flushRecord();
    curNum = onlyNum[1];
    curText = "";
    continue;
  }

  if (numbered) {
    flushRecord();
    curNum = numbered[1];
    curText = numbered[2];
    continue;
  }

  if (curNum != null) {
    curText += " " + trimmed;
  }
}
flushRecord();

/** Заголовки разделов PDF (без цены). Не путать с позицией без цены, но с ед. изм. («точка», «шт» и т.д.) */
function isSectionHeading(rec) {
  if (rec.price != null) return false;
  const n = rec.name.length;
  if (n > 95) return false;
  const u = (rec.unit || "").trim();
  if (u && u !== "—") return false;
  return true;
}

function slugifyRu(s) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 56) || "section"
  );
}

const sections = [];
let sec = null;

for (const rec of records) {
  if (isSectionHeading(rec)) {
    if (sec) sections.push(sec);
    sec = { slug: slugifyRu(rec.name) + "-" + sections.length, title: rec.name, items: [] };
    continue;
  }
  if (!sec) {
    sec = { slug: "montazh-kabela", title: "Монтаж кабеля", items: [] };
  }
  sec.items.push({
    pdfLine: rec.pdfLine,
    name: rec.name,
    unit: rec.unit,
    price: rec.price,
    isHeading: false,
  });
}
if (sec) sections.push(sec);

for (const s of sections) {
  const i = s.items.findIndex(
    (it) => it.pdfLine === 1 && it.price == null && /^Монтаж кабеля$/i.test(it.name.trim())
  );
  if (i >= 0) s.items.splice(i, 1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ sections }, null, 2), "utf8");

const itemCount = sections.reduce((a, s) => a + s.items.length, 0);
console.log("Wrote", outPath, "sections:", sections.length, "items:", itemCount);
