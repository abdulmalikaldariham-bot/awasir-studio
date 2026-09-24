import type { Brand, Custom, SizeId, StyleId, ThemeId } from "./types";

export interface SizeSpec { id: SizeId; name: string; hint: string; w: number; h: number }

export const SIZES: Record<SizeId, SizeSpec> = {
  post: { id: "post", name: "منشور مربع", hint: "إنستقرام ١٠٨٠×١٠٨٠", w: 1080, h: 1080 },
  portrait: { id: "portrait", name: "منشور طولي", hint: "إنستقرام ١٠٨٠×١٣٥٠", w: 1080, h: 1350 },
  story: { id: "story", name: "ستوري وحالة واتساب", hint: "١٠٨٠×١٩٢٠", w: 1080, h: 1920 },
  whatsapp: { id: "whatsapp", name: "بطاقة واتساب", hint: "١٠٨٠×١٤٤٠", w: 1080, h: 1440 },
  a4: { id: "a4", name: "ورقة A4", hint: "للطباعة ٣٠٠ نقطة/إنش", w: 1240, h: 1754 },
  wide: { id: "wide", name: "عرض أفقي ١٦:٩", hint: "١٩٢٠×١٠٨٠", w: 1920, h: 1080 },
};
export const SIZE_ORDER: SizeId[] = ["post", "portrait", "story", "whatsapp", "a4", "wide"];

export type Shape = "tall" | "portrait" | "square" | "wide";
export function shapeOf(w: number, h: number): Shape {
  const r = h / w;
  if (r >= 1.6) return "tall";
  if (r >= 1.15) return "portrait";
  if (r <= 0.8) return "wide";
  return "square";
}

export const STYLE_INFO: Record<StyleId, { name: string; description: string; defaultTheme: ThemeId }> = {
  formal: { name: "رسمي", description: "خلفية داكنة، إطار رفيع، ونص في المنتصف", defaultTheme: "navy" },
  minimal: { name: "بسيط", description: "مساحات بيضاء واسعة ونص محاذى لليمين", defaultTheme: "light" },
  premium: { name: "فاخر", description: "تدرج لوني وحلقات سداسية كبيرة خلف النص", defaultTheme: "navy" },
  split: { name: "حديث", description: "قسمان: مساحة للصورة أو النمط، ومساحة للنص", defaultTheme: "navy" },
  photo: { name: "بالصورة", description: "صورة كاملة وتدرج يحفظ وضوح النص", defaultTheme: "navy" },
  family: { name: "عائلي", description: "بطاقة فاتحة دافئة داخل نمط سداسي هادئ", defaultTheme: "light" },
};

export const THEME_NAMES: Record<ThemeId, string> = { navy: "كحلي", teal: "فيروزي", light: "فاتح" };

export interface Palette {
  bg: string; bg2: string; fg: string; muted: string; accent: string; line: string; card: string; dark: boolean;
}

export function palette(theme: ThemeId, brand: Brand, accent?: Custom["accent"]): Palette {
  const { navy, teal, light } = brand.colors;
  const base: Record<ThemeId, Palette> = {
    navy: { bg: navy, bg2: teal, fg: "#FFFFFF", muted: "rgba(255,255,255,.74)", accent: light, line: hexA(light, 0.32), card: hexA("#FFFFFF", 0.06), dark: true },
    teal: { bg: teal, bg2: navy, fg: "#FFFFFF", muted: "rgba(255,255,255,.8)", accent: mix(light, "#FFFFFF", 0.45), line: hexA("#FFFFFF", 0.26), card: hexA(navy, 0.18), dark: true },
    light: { bg: mix(light, "#FFFFFF", 0.86), bg2: mix(light, "#FFFFFF", 0.62), fg: navy, muted: mix(navy, "#FFFFFF", 0.28), accent: teal, line: hexA(teal, 0.28), card: "#FFFFFF", dark: false },
  };
  const p = { ...base[theme] };
  if (accent) {
    const pick = { teal, light, navy, white: "#FFFFFF" }[accent];
    // لا نسمح بلون إبراز يختفي على الخلفية
    if (pick && contrast(pick, p.bg) >= 1.8) p.accent = pick;
  }
  return p;
}

// ألوان الإبراز الصالحة لكل خلفية
export function accentOptions(theme: ThemeId, brand: Brand) {
  const p = palette(theme, brand);
  const all: { id: NonNullable<Custom["accent"]>; name: string; color: string }[] = [
    { id: "light", name: "فيروزي فاتح", color: brand.colors.light },
    { id: "teal", name: "فيروزي", color: brand.colors.teal },
    { id: "navy", name: "كحلي", color: brand.colors.navy },
    { id: "white", name: "أبيض", color: "#FFFFFF" },
  ];
  return all.filter((a) => contrast(a.color, p.bg) >= 1.8);
}

// ---- أدوات الألوان ----
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function hexA(hex: string, a: number) {
  const [r, g, b] = rgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
export function mix(a: string, b: string, t: number) {
  const A = rgb(a), B = rgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}
function lum(hex: string) {
  const s = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}
export function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

export const DEFAULT_CUSTOM: Custom = {
  hidden: [],
  titleScale: 1,
  bodyScale: 1,
  logo: "full",
  pattern: "rings",
};
