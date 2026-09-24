import type { Brand, Slots, Template } from "./types";

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const toArabicDigits = (s: string) => s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);
export const toLatinDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

function parseDate(v: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  const d = new Date(`${v}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(d: Date, opts: Intl.DateTimeFormatOptions, cal: string, digits: Brand["digits"]) {
  const nu = digits === "arabic" ? "arab" : "latn";
  return new Intl.DateTimeFormat(`ar-SA-u-ca-${cal}-nu-${nu}`, opts).format(d);
}

type FilterFn = (value: string, brand: Brand, arg?: string) => string;

// المرشحات المتاحة في نصوص القوالب: {{date|hijri}} {{gender|g:ابنه:ابنته}}
const FILTERS: Record<string, FilterFn> = {
  hijri: (v, b) => {
    const d = parseDate(v);
    return d ? fmt(d, { day: "numeric", month: "long", year: "numeric" }, "islamic-umalqura", b.digits) : v;
  },
  gregorian: (v, b) => {
    const d = parseDate(v);
    return d ? fmt(d, { day: "numeric", month: "long", year: "numeric" }, "gregory", b.digits) + " م" : v;
  },
  weekday: (v, b) => {
    const d = parseDate(v);
    return d ? fmt(d, { weekday: "long" }, "gregory", b.digits) : "";
  },
  // التاريخ الكامل: الخميس ١٠ محرم ١٤٤٨ هـ
  full: (v, b) => {
    const d = parseDate(v);
    if (!d) return v;
    return `${FILTERS.weekday(v, b)} ${FILTERS.hijri(v, b)}`;
  },
  // المذكر/المؤنث حسب حقل الجنس
  g: (v, _b, arg) => {
    const [m = "", f = ""] = (arg ?? "").split(":");
    return v === "أنثى" ? f : m;
  },
  digits: (v, b) => (b.digits === "arabic" ? toArabicDigits(v) : toLatinDigits(v)),
};

/**
 * يستبدل {{key}} و{{key|filter:arg}} بالقيم.
 * المقطع [[ ... ]] يُحذف كاملاً إذا كان أي متغير بداخله فارغاً.
 */
export function interpolate(tpl: string | undefined, values: Record<string, string>, brand: Brand): string {
  if (!tpl) return "";
  const one = (s: string): { text: string; missing: boolean } => {
    let missing = false;
    const text = s.replace(/\{\{\s*([\w.]+)\s*(?:\|\s*(\w+)(?::([^}]*))?)?\s*\}\}/g, (_m, key: string, filter?: string, arg?: string) => {
      const raw = key === "signature" && !values.signature ? brand.signature : (values[key] ?? "").trim();
      if (!raw && filter !== "g") { missing = true; return ""; }
      const f = filter ? FILTERS[filter] : undefined;
      return f ? f(raw, brand, arg) : raw;
    });
    return { text, missing };
  };
  const withOptional = tpl.replace(/\[\[([\s\S]*?)\]\]/g, (_m, inner: string) => {
    const r = one(inner);
    return r.missing ? "" : r.text;
  });
  return one(withOptional).text.replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export interface ResolvedContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  details: { icon: string; label: string; value: string }[];
  stats: { label: string; value: string }[];
  note: string;
  qr: string;
  qrLabel: string;
  footer: string;
  order: "title-first" | "body-first";
}

export function resolveContent(t: Template, values: Record<string, string>, brand: Brand): ResolvedContent {
  const s: Slots = t.slots;
  const v = { ...t.defaults, ...values };
  const I = (x?: string) => interpolate(x, v, brand);
  const qrKey = s.qr?.trim();
  const qr = qrKey ? (v[qrKey] ?? "").trim() : "";
  return {
    eyebrow: I(s.eyebrow),
    title: I(s.title),
    subtitle: I(s.subtitle),
    body: I(s.body),
    details: (s.details ?? [])
      .map((d) => ({ icon: d.icon, label: I(d.label), value: I(d.value) }))
      .filter((d) => d.value),
    stats: (s.stats ?? [])
      .map((d) => ({ label: I(d.label), value: I(d.value) }))
      .filter((d) => d.value && d.label),
    note: I(s.note),
    qr: /^https?:\/\//i.test(qr) ? qr : "",
    qrLabel: I(s.qrLabel),
    footer: I(s.footer),
    order: s.order ?? "title-first",
  };
}

// نص مختصر لطول المحتوى (لضبط الأحجام تلقائياً)
export const textWeight = (s: string) => s.replace(/\s+/g, " ").length;
