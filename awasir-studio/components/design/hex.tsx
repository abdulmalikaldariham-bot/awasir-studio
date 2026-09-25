"use client";
// النمط السداسي لأواصر (ملف مستقل وخفيف ليُستخدم خارج محرك التصميم)
import { useId, useMemo, type CSSProperties } from "react";

// ---------- النمط السداسي ----------
function hexPath(cx: number, cy: number, r: number) {
  const h = r * 0.866;
  return `M${cx + r} ${cy}L${cx + r / 2} ${cy + h}L${cx - r / 2} ${cy + h}L${cx - r} ${cy}L${cx - r / 2} ${cy - h}L${cx + r / 2} ${cy - h}Z`;
}

/** حلقات سداسية متداخلة كما في دليل الهوية */
export function HexRings({ count = 7, gap = 1, stroke, width = 1.2, className, style }: {
  count?: number; gap?: number; stroke: string; width?: number; className?: string; style?: CSSProperties;
}) {
  const d = useMemo(() => {
    const parts: string[] = [];
    for (let i = 1; i <= count; i++) parts.push(hexPath(100, 100, (100 / count) * i * gap));
    return parts.join("");
  }, [count, gap]);
  return (
    <svg viewBox="-2 -2 204 204" className={className} style={style} aria-hidden>
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** شبكة خلايا سداسية هادئة تغطي الخلفية */
export function HexGrid({ stroke, cell, opacity = 1 }: { stroke: string; cell: number; opacity?: number }) {
  const w = cell * 3, h = cell * 1.732;
  const d = `${hexPath(cell, h / 2, cell)}M${cell * 2.5} ${h}L${cell * 3} ${h}M${cell * 2.5} 0L${cell * 3} 0`;
  const id = "hg" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg className="aw-fill" aria-hidden style={{ opacity }}>
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          <path d={d} fill="none" stroke={stroke} strokeWidth={1.4} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

