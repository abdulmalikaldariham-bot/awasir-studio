// الصور المصغرة الجاهزة للقوالب (WebP خفيفة) بدل رسم التصميم الكامل في كل بطاقة.
// تُولَّد بالأمر: npm run thumbs  (انظر scripts/thumbs.mjs)
// إذا عُدّل القالب من لوحة الإدارة تتغير بصمته، فيُرسم مباشرة في المتصفح بدل صورة قديمة.
import manifest from "@/data/thumbs.json";
import { hash } from "./hash";
import { occasionOf } from "./occasions";
import type { Library, Template } from "./types";

/** غيّر هذا الرقم عند تعديل محرك التصميم ليُعاد توليد كل الصور المصغرة */
export const DESIGN_VERSION = 2;

export const THUMB_W = { sm: 240, md: 480 } as const;

type Manifest = Record<string, { k: string; n: number }>;
const M = manifest as Manifest;

export function thumbKey(t: Template, lib: Library): string {
  const preset = lib.presets.find((p) => p.id === t.presetGroup)?.texts[0]?.text ?? "";
  return hash(JSON.stringify([DESIGN_VERSION, t, lib.brand, preset]));
}

export function thumbDir(t: Template) {
  return `/assets/${occasionOf(t).id}/thumbs`;
}

/** رابط الصورة المصغرة إن كانت مطابقة للقالب الحالي، وإلا null */
export function thumbSrc(t: Template, lib: Library, style: number) {
  const m = M[t.id];
  if (!m || style >= m.n) return null;
  const k = thumbKey(t, lib);
  if (m.k !== k) return null;
  const base = `${thumbDir(t)}/${t.id}-${style}`;
  return {
    src: `${base}-md.webp?v=${k}`,
    srcSet: `${base}-sm.webp?v=${k} ${THUMB_W.sm}w, ${base}-md.webp?v=${k} ${THUMB_W.md}w`,
    sm: `${base}-sm.webp?v=${k}`,
  };
}
