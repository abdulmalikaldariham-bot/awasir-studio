"use client";
import { useEffect, useRef, useState } from "react";
import type { SizeId, Template } from "@/lib/types";
import { sampleValues, useLibrary } from "@/lib/library";
import { thumbSrc } from "@/lib/thumbs";
import { PreviewOnDemand as Preview } from "@/components/design/PreviewOnDemand";

/**
 * معاينة مصغرة سريعة لقالب:
 * ١) صورة WebP خفيفة جاهزة مع srcset (تُحمّل عند ظهورها فقط)،
 * ٢) وإن لم تتوفر (قالب جديد أو معدّل): يُرسم التصميم فقط عند ظهوره في الشاشة.
 * وفي الحالتين يظهر هيكل تحميل هادئ بدل مساحة فارغة.
 */
export function Thumb({ t, style = 0, sizes = "(min-width:1024px) 18vw, (min-width:640px) 30vw, 46vw", small, className = "", priority }: {
  t: Template; style?: number; sizes?: string; small?: boolean; className?: string; priority?: boolean;
}) {
  const { library } = useLibrary();
  const th = thumbSrc(t, library, style);
  const [loaded, setLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // الصورة قد تكون محمّلة من الذاكرة قبل ربط onLoad
  useEffect(() => { if (img.current?.complete && img.current.naturalWidth) setLoaded(true); }, [th?.src]);
  if (!th) return <LazyPreview t={t} style={style} className={className} />;
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-mist-100 ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={small ? th.sm : th.src} srcSet={small ? undefined : th.srcSet} sizes={small ? undefined : sizes}
        width={480} height={600} alt="" loading={priority ? "eager" : "lazy"} decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}

/** يرسم التصميم الحي فقط عندما يقترب من الظهور على الشاشة */
export function LazyPreview({ t, style = 0, size = "portrait", className = "", values }: {
  t: Template; style?: number; size?: SizeId; className?: string; values?: Record<string, string>;
}) {
  const { library } = useLibrary();
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return (
    <div ref={box} className={`relative overflow-hidden bg-mist-100 ${className}`} style={{ aspectRatio: size === "portrait" ? "4 / 5" : undefined }}>
      {seen ? (
        <Preview template={t} values={values ?? sampleValues(t, library)} styleIndex={style} size={size} className="w-full" />
      ) : (
        <div className="skeleton absolute inset-0" />
      )}
    </div>
  );
}

/** يؤجل رسم محتوى ثقيل حتى يقترب من الظهور على الشاشة */
export function WhenVisible({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return <div ref={box} className={`relative ${className}`}>{seen ? children : <div className="skeleton absolute inset-0" />}</div>;
}
