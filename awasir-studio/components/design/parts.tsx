"use client";
import { useId, useLayoutEffect, useMemo, useRef, type CSSProperties, type ReactNode } from "react";
import QRCode from "qrcode";
import type { Brand, Custom, LogoFile, ThemeId } from "@/lib/types";
import type { ResolvedContent } from "@/lib/format";

// ---------- الشعار ----------
export function logoSrc(brand: Brand, file: LogoFile) {
  return brand.logos?.[file] || `/brand/${file}.svg`;
}
export function Logo({ brand, kind, theme, layout, className, style }: {
  brand: Brand; kind: Custom["logo"]; theme: ThemeId; layout: "vertical" | "horizontal";
  className?: string; style?: CSSProperties;
}) {
  if (kind === "none") return null;
  const tone = theme === "light" ? "light" : theme === "teal" ? "white" : "dark";
  const file: LogoFile = kind === "mark"
    ? (theme === "teal" ? "mark-white" : "mark")
    : (`${layout}-${tone}` as LogoFile);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={logoSrc(brand, file)} alt="أواصر" className={className} style={style} draggable={false} />;
}

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

// ---------- أيقونات التفاصيل ----------
const ICONS: Record<string, string> = {
  calendar: "M4 7h16M4 7v12h16V7M4 7V5h16v2M8 3v4M16 3v4",
  clock: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v5l3 2",
  pin: "M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21zM12 7.5a2.3 2.3 0 1 0 0 4.6a2.3 2.3 0 1 0 0-4.6",
  building: "M4 21V5l8-2v18M12 7l8 2v12M3 21h18M7 9h2M7 13h2M7 17h2M15 12h2M15 16h2",
  user: "M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5",
  users: "M9 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7M2.5 20c0-3.6 2.9-5.8 6.5-5.8s6.5 2.2 6.5 5.8M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.6c1.8.8 3 2.6 3 5.4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  info: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 11v6M12 7.5v.5",
  phone: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  star: "M12 3l2.7 5.6l6.1.9l-4.4 4.3l1 6.1L12 17l-5.4 2.9l1-6.1L3.2 9.5l6.1-.9z",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21a2 2 0 0 1 2-2h13v2H6",
  flag: "M5 21V4M5 4h11l-2 4l2 4H5",
};
export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name] ?? ICONS.info} />
    </svg>
  );
}

// ---------- رمز QR ----------
export function QR({ value, fg = "#1C3F4E" }: { value: string; fg?: string }) {
  const d = useMemo(() => {
    try {
      const q = QRCode.create(value, { errorCorrectionLevel: "M" });
      const n = q.modules.size;
      let p = "";
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) p += `M${x} ${y}h1v1h-1z`;
      return { p, n };
    } catch { return null; }
  }, [value]);
  if (!d) return null;
  return (
    <svg viewBox={`-2 -2 ${d.n + 4} ${d.n + 4}`} className="aw-qr-svg" shapeRendering="crispEdges" aria-label="رمز QR">
      <rect x="-2" y="-2" width={d.n + 4} height={d.n + 4} fill="#fff" />
      <path d={d.p} fill={fg} />
    </svg>
  );
}

// ---------- الصورة ----------
export function Photo({ img, className, style }: { img: NonNullable<Custom["image"]>; className?: string; style?: CSSProperties }) {
  return (
    <div className={`aw-photo ${className ?? ""}`} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.src}
        alt=""
        draggable={false}
        style={{
          objectPosition: `${img.x}% ${img.y}%`,
          transform: `scale(${img.zoom})`,
          transformOrigin: `${img.x}% ${img.y}%`,
        }}
      />
    </div>
  );
}

// ---------- ملاءمة النص تلقائياً ----------
/** يصغّر الخطوط تدريجياً حتى يتسع المحتوى في مساحته، بدل أن يخرج عن التصميم */
export function AutoFit({ children, deps, className, style }: { children: ReactNode; deps: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      let f = 1;
      el.style.setProperty("--fit", "1");
      while (f > 0.5 && el.scrollHeight > el.clientHeight + 1) {
        f = Math.round((f - 0.04) * 100) / 100;
        el.style.setProperty("--fit", String(f));
      }
      el.dataset.fit = String(f);
    };
    run();
    let alive = true;
    document.fonts?.ready.then(() => alive && run());
    return () => { alive = false; };
  }, [deps]);
  return <div ref={ref} className={`aw-fit ${className ?? ""}`} style={style}>{children}</div>;
}

// ---------- كومة المحتوى ----------
export function Ornament() {
  return (
    <div className="aw-orn" aria-hidden>
      <span />
      <svg viewBox="0 0 20 18"><path d="M19 9L14.5 16.8H5.5L1 9L5.5 1.2H14.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      <span />
    </div>
  );
}

export function Stack({ c, hidden, ornament, image }: {
  c: ResolvedContent; hidden: Set<string>; ornament?: boolean; image?: ReactNode; dark?: boolean;
}) {
  const show = (k: keyof ResolvedContent) => !hidden.has(k) && Boolean(c[k] && (Array.isArray(c[k]) ? (c[k] as unknown[]).length : true));
  const len = c.title.replace(/\s+/g, "").length;
  // العناوين الطويلة تبدأ بحجم أصغر قبل الملاءمة التلقائية
  const tScale = len <= 8 ? 1.22 : len <= 14 ? 1 : Math.max(0.58, Math.sqrt(14 / len));
  const titleBlock = (
    <>
      {show("title") && <h1 className="aw-title" style={{ "--ts": tScale } as CSSProperties}>{c.title}</h1>}
      {show("subtitle") && <p className="aw-subtitle">{c.subtitle}</p>}
    </>
  );
  const bodyBlock = show("body") ? <p className="aw-body">{c.body}</p> : null;
  const hasTitle = show("title") || show("subtitle");
  const aside = show("stats") || show("details") || show("note") || show("qr");
  return (
    <div className={`aw-stack ${aside ? "has-aside" : ""}`}>
      <div className="aw-main">
        {image}
        {show("eyebrow") && <p className="aw-eyebrow">{c.eyebrow}</p>}
        {c.order === "body-first" ? (<>{bodyBlock}{titleBlock}</>) : (<>{titleBlock}{ornament && hasTitle && bodyBlock && <Ornament />}{bodyBlock}</>)}
      </div>
      {aside && (
        <div className="aw-aside">
          {show("stats") && (
            <div className="aw-stats">
              {c.stats.map((s, i) => (
                <div key={i} className="aw-stat"><strong>{s.value}</strong><span>{s.label}</span></div>
              ))}
            </div>
          )}
          {show("details") && (
            <ul className="aw-details">
              {c.details.map((d, i) => (
                <li key={i}>
                  <Icon name={d.icon} className="aw-ico" />
                  {d.label && <span className="aw-dl">{d.label}</span>}
                  <span className="aw-dv">{d.value}</span>
                </li>
              ))}
            </ul>
          )}
          {show("note") && <p className="aw-note">{c.note}</p>}
          {show("qr") && (
            <div className="aw-qr">
              <QR value={c.qr} />
              {c.qrLabel && <span>{c.qrLabel}</span>}
            </div>
          )}
        </div>
      )}
      {show("footer") && <p className="aw-footer">{c.footer}</p>}
    </div>
  );
}
