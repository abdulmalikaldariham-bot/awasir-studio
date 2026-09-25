import type { CSSProperties, ReactNode } from "react";

export interface ArtProps { className?: string; style?: CSSProperties }

/** إطار موحد لكل الرسوم: خطوط رفيعة بلون العنصر، وتعبئة شفافة خفيفة للعمق */
export function Svg({ vb, children, className, style, sw = 1.6 }: ArtProps & { vb: string; children: ReactNode; sw?: number }) {
  return (
    <svg viewBox={vb} className={className} style={style} aria-hidden fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** تعبئة خفيفة بنفس لون الخط */
export const soft = { fill: "currentColor", fillOpacity: 0.14 } as const;
export const solid = { fill: "currentColor", stroke: "none" } as const;

/** نجمة رباعية لامعة */
export const sparkle = (x: number, y: number, r: number) =>
  `M${x} ${y - r}Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z`;

/** نجمة ثمانية (مربعان متداخلان) */
export function star8(cx: number, cy: number, r: number) {
  const sq = (rot: number) => {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = rot + (Math.PI / 2) * i;
      return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    });
    return `M${pts.join("L")}Z`;
  };
  return sq(0) + sq(Math.PI / 4);
}

export function hexPath(cx: number, cy: number, r: number) {
  const h = r * 0.866;
  return `M${cx + r} ${cy}L${cx + r / 2} ${cy + h}L${cx - r / 2} ${cy + h}L${cx - r} ${cy}L${cx - r / 2} ${cy - h}L${cx + r / 2} ${cy - h}Z`;
}

/** دائرة بحافة متموجة (الختم والوسام) */
export function scallop(cx: number, cy: number, r: number, n: number, depth: number) {
  let d = "";
  for (let i = 0; i <= n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rr = i % 2 ? r - depth : r;
    const x = (cx + rr * Math.cos(a)).toFixed(2), y = (cy + rr * Math.sin(a)).toFixed(2);
    d += i === 0 ? `M${x} ${y}` : `L${x} ${y}`;
  }
  return d + "Z";
}
