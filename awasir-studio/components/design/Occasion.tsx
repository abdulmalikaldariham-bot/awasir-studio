"use client";
// طبقة المناسبة: عناصر زخرفية ثابتة خلف المحتوى. معزولة بـ memo حتى لا يُعاد رسمها عند كتابة النص.
import { memo, type CSSProperties } from "react";
import type { ArtId, Occasion } from "@/lib/occasions";
import type { StyleId } from "@/lib/types";
import type { Shape } from "@/lib/design";
import { Art } from "./art";
import { Lantern } from "./art/ramadan";
import { Mosque } from "./art/eid";
import { Mountains } from "./art/gathering";
import { hexPath, sparkle } from "./art/base";

export interface LayerProps {
  occ: Occasion;
  style: StyleId;
  shape: Shape;
  hero: ArtId;
  w: number;
  h: number;
  u: number;
  hasImage: boolean;
}

/** ما يظهر من عناصر المناسبة في كل شكل */
export function layerPlan(occ: Occasion, style: StyleId, hasImage: boolean) {
  const quiet = occ.title === "quiet";
  // الشكل الحديث يعرض عنصر المناسبة داخل لوحته، فلا نضيف زخارف فوق النص
  const open = !quiet && style !== "split";
  return {
    frame: style === "formal" ? occ.frame : "none",
    hang: open && occ.hang !== "none" && !(style === "photo" && hasImage) ? occ.hang : "none",
    ground: open && occ.ground !== "none" && style !== "photo" ? occ.ground : "none",
    sprinkle: open && occ.sprinkle !== "none" && !(style === "photo" && hasImage) ? occ.sprinkle : "none",
    hero: !open ? "none" : style === "minimal" ? "corner" : style === "premium" ? "watermark" : style === "photo" && !hasImage ? "hero" : "none",
    /** رمز صغير فوق العنوان في الأشكال التي لا يظهر فيها العنصر الرئيسي */
    emblem: !quiet && (style === "formal" || style === "family") && occ.hang === "none",
  } as const;
}

export const OccasionLayer = memo(function OccasionLayer({ occ, style, shape, hero, w, h, u, hasImage }: LayerProps) {
  const plan = layerPlan(occ, style, hasImage);
  const seed = occ.id.length + style.length;
  return (
    <div className="aw-fill aw-occ" aria-hidden>
      {plan.frame !== "none" && <Frame kind={plan.frame} w={w} h={h} u={u} shape={shape} />}
      {plan.hero === "watermark" && <Art id={hero} className="aw-hero-wm" />}
      {plan.hero === "corner" && <Art id={hero} className="aw-hero-corner" />}
      {plan.hero === "hero" && <Art id={hero} className="aw-hero-top" />}
      {plan.hang === "lanterns" && <Lanterns style={style} shape={shape} h={h} u={u} />}
      {plan.hang === "bunting" && <Bunting w={w} h={h} u={u} />}
      {plan.hang === "stars" && <HangingStars style={style} shape={shape} w={w} h={h} u={u} />}
      {plan.ground === "mosque" && <Mosque className="aw-ground" />}
      {plan.ground === "mountains" && <Mountains className="aw-ground" />}
      {plan.ground === "najdi" && <Najdi w={w} u={u} />}
      {plan.sprinkle !== "none" && <Sprinkle kind={plan.sprinkle} seed={seed} w={w} h={h} u={u} />}
    </div>
  );
});

/** الإطار: قوس معماري، إطار مزدوج، شرفات نجدية، أو خط رفيع */
function Frame({ kind, w, h, u, shape }: { kind: string; w: number; h: number; u: number; shape: Shape }) {
  const m = u * 3.4, m2 = u * 4.6;
  if (kind === "arch") {
    const arch = (inset: number) => {
      const x0 = inset, x1 = w - inset, y1 = h - inset, top = inset;
      const rise = Math.min((x1 - x0) * (shape === "wide" ? 0.2 : 0.42), h * 0.3);
      const spring = top + rise;
      const cx = w / 2;
      // قوس مدبب: منحنيان يلتقيان في القمة
      return `M${x0} ${y1}V${spring}C${x0} ${spring - rise * 0.62} ${cx - (x1 - x0) * 0.22} ${top + rise * 0.18} ${cx} ${top}C${cx + (x1 - x0) * 0.22} ${top + rise * 0.18} ${x1} ${spring - rise * 0.62} ${x1} ${spring}V${y1}Z`;
    };
    return (
      <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <path d={arch(m)} fill="none" stroke="var(--orn)" strokeWidth={u * 0.22} />
        <path d={arch(m2)} fill="none" stroke="var(--orn)" strokeOpacity={0.45} strokeWidth={u * 0.12} />
        <path d={sparkle(w / 2, m - u * 0.2, u * 1.6)} fill="var(--orn)" />
      </svg>
    );
  }
  if (kind === "double") {
    const c = u * 1.4;
    const corners = [[m, m], [w - m, m], [m, h - m], [w - m, h - m]];
    return (
      <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <rect x={m} y={m} width={w - m * 2} height={h - m * 2} fill="none" stroke="var(--orn)" strokeWidth={u * 0.2} />
        <rect x={m2} y={m2} width={w - m2 * 2} height={h - m2 * 2} fill="none" stroke="var(--orn)" strokeOpacity={0.45} strokeWidth={u * 0.1} />
        {corners.map(([x, y], i) => <path key={i} d={`M${x} ${y - c}L${x + c} ${y}L${x} ${y + c}L${x - c} ${y}Z`} fill="var(--orn)" />)}
      </svg>
    );
  }
  if (kind === "najdi") {
    const t = u * 2.2, n = Math.floor((w - m * 2) / (t * 1.4));
    const start = (w - n * t * 1.4) / 2 + t * 0.2;
    let teeth = "";
    for (let i = 0; i < n; i++) { const x = start + i * t * 1.4; teeth += `M${x} ${m + t}L${x + t / 2} ${m}L${x + t} ${m + t}Z`; }
    return (
      <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>
        <rect x={m} y={m} width={w - m * 2} height={h - m * 2} fill="none" stroke="var(--orn)" strokeOpacity={0.7} strokeWidth={u * 0.16} />
        <path d={teeth} fill="var(--orn)" fillOpacity={0.5} transform={`translate(0 ${u * 1})`} />
        <path d={teeth} fill="var(--orn)" fillOpacity={0.5} transform={`translate(0 ${h - m * 2 - t - u}) `} />
      </svg>
    );
  }
  return <div className="aw-frame" />;
}

/** مواضع العناصر المعلقة: بعيداً عن الشعار، وعلى الأطراف في الشكل العائلي */
function hangSet(style: StyleId, shape: Shape): [number, number, number][] {
  if (style === "family") return shape === "wide" ? [[3.5, 30, 1], [96.5, 18, 0.9]] : [[4, 22, 1], [96, 13, 0.9]];
  // الشعار في الأعلى يميناً: العناصر في اليسار فقط
  if (style === "minimal" || style === "photo") return shape === "wide" ? [[4, 22, 1], [9, 38, 0.85], [14, 16, 0.75]] : [[6, 13, 1], [13, 24, 0.85], [20, 9, 0.7]];
  return shape === "wide" ? [[4, 20, 1], [9, 34, 0.85], [91, 26, 0.85], [96, 12, 1]] : [[6, 13, 1], [13, 23, 0.85], [87, 19, 0.85], [94, 8, 1]];
}

/** فوانيس معلقة بأطوال مختلفة */
function Lanterns({ style, shape, h, u }: { style: StyleId; shape: Shape; h: number; u: number }) {
  return (
    <>
      {hangSet(style, shape).map(([x, len, k], i) => (
        <div key={i} className="aw-lantern" style={{ left: `${x}%`, "--k": k } as CSSProperties}>
          <span className="aw-string" style={{ height: (len / 100) * h }} />
          <span className="aw-glow" />
          <Lantern className="aw-lantern-svg" />
        </div>
      ))}
    </>
  );
}

/** نجوم معلقة بخيوط (المواليد) */
function HangingStars({ style, shape, w, h, u }: { style: StyleId; shape: Shape; w: number; h: number; u: number }) {
  return (
    <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {hangSet(style, shape).map(([x, len, k], i) => {
        const X = (x / 100) * w, L = (len / 100) * h * 0.8, r = u * 2.6 * k;
        return (
          <g key={i}>
            <path d={`M${X} 0V${L}`} stroke="var(--orn)" strokeOpacity={0.6} strokeWidth={u * 0.14} />
            <path d={sparkle(X, L + r * 0.9, r)} fill="var(--orn)" />
          </g>
        );
      })}
    </svg>
  );
}

/** زينة أعلام مثلثة في قوسين */
function Bunting({ w, h, u }: { w: number; h: number; u: number }) {
  const swag = (x0: number, x1: number, y: number, sag: number) => {
    const flags: string[] = [];
    const n = Math.max(5, Math.round((x1 - x0) / (u * 6)));
    for (let i = 1; i < n; i++) {
      const t = i / n;
      const x = x0 + (x1 - x0) * t;
      const yy = y + 4 * sag * t * (1 - t);
      const f = u * 2.2;
      flags.push(`M${x - f} ${yy - f * 0.1}L${x + f} ${yy + f * 0.1}L${x} ${yy + f * 2.4}Z`);
    }
    return { line: `M${x0} ${y}Q${(x0 + x1) / 2} ${y + 2 * sag} ${x1} ${y}`, flags };
  };
  const y = u * 1.5, sag = u * 5.5;
  const a = swag(-u * 2, w * 0.36, y, sag), b = swag(w * 0.64, w + u * 2, y, sag);
  return (
    <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {[a, b].map((s, k) => (
        <g key={k}>
          <path d={s.line} fill="none" stroke="var(--orn)" strokeWidth={u * 0.16} strokeOpacity={0.7} />
          {s.flags.map((f, i) => <path key={i} d={f} fill={i % 2 ? "var(--orn)" : "var(--light)"} fillOpacity={i % 2 ? 0.9 : 0.75} />)}
        </g>
      ))}
    </svg>
  );
}

/** شريط الشرفات النجدية في أسفل التصميم */
function Najdi({ w, u }: { w: number; u: number }) {
  const t = u * 3, gap = u * 1.2, n = Math.ceil(w / (t + gap)) + 1;
  let d = "";
  for (let i = 0; i < n; i++) { const x = i * (t + gap); d += `M${x} ${t * 1.2}L${x + t / 2} 0L${x + t} ${t * 1.2}Z`; }
  const hgt = t * 1.2 + u * 2.4;
  return (
    <svg className="aw-najdi" viewBox={`0 0 ${w} ${hgt}`} preserveAspectRatio="none" aria-hidden>
      <path d={d} fill="var(--orn)" fillOpacity={0.45} />
      <rect x="0" y={t * 1.2 + u * 0.8} width={w} height={u * 0.25} fill="var(--orn)" fillOpacity={0.7} />
      <rect x="0" y={t * 1.2 + u * 1.6} width={w} height={u * 0.8} fill="var(--orn)" fillOpacity={0.3} />
    </svg>
  );
}

// مواضع ثابتة على الأطراف فقط، حتى لا تتداخل الزخرفة مع النص
const EDGE: [number, number][] = [
  [5, 8], [15, 4], [93, 6], [84, 12], [3, 34], [97, 40], [6, 62], [95, 66], [4, 90], [16, 95], [88, 92], [96, 84], [30, 3], [70, 5], [28, 97], [72, 96],
];

function Sprinkle({ kind, seed, w, h, u }: { kind: string; seed: number; w: number; h: number; u: number }) {
  const pts = EDGE.filter((_, i) => (i + seed) % (kind === "confetti" ? 1 : 2) === 0);
  const shapes = pts.map(([px, py], i) => {
    const x = (px / 100) * w, y = (py / 100) * h;
    const r = u * (kind === "confetti" ? 0.9 + ((i * 7 + seed) % 5) * 0.2 : 0.8 + ((i * 5 + seed) % 4) * 0.35);
    if (kind === "stars" || kind === "sparkles" || i % 4 === 0) return <path key={i} d={sparkle(x, y, r * 1.4)} fill="var(--orn)" fillOpacity={i % 3 ? 0.9 : 0.55} />;
    if (i % 4 === 1) return <path key={i} d={hexPath(x, y, r)} fill="var(--light)" fillOpacity={0.7} />;
    if (i % 4 === 2) return <rect key={i} x={x - r * 0.3} y={y - r} width={r * 0.6} height={r * 2} rx={r * 0.3} fill="var(--orn)" transform={`rotate(${(i * 37) % 180} ${x} ${y})`} />;
    return <circle key={i} cx={x} cy={y} r={r * 0.5} fill="var(--light)" fillOpacity={0.8} />;
  });
  return <svg className="aw-fill" viewBox={`0 0 ${w} ${h}`} aria-hidden>{shapes}</svg>;
}

/** الرمز الصغير فوق العنوان */
export function Emblem({ id }: { id: ArtId }) {
  return <Art id={id} className="aw-emblem" />;
}
