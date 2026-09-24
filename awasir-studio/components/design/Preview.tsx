"use client";
import { forwardRef, useEffect, useRef, useState } from "react";
import { SIZES } from "@/lib/design";
import { useLibrary } from "@/lib/library";
import { Design, type DesignProps } from "./Design";

type Props = Omit<DesignProps, "brand" | "backgrounds"> & { fit?: "width" | "contain"; className?: string };

/** يعرض التصميم مصغّراً ليملأ مساحته، مع الحفاظ على المقاس الحقيقي للتصدير */
export const Preview = forwardRef<HTMLDivElement, Props>(function Preview({ fit = "width", className, ...p }, ref) {
  const { library } = useLibrary();
  const box = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState<{ w: number; h: number } | null>(null);
  const spec = SIZES[p.size];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setAvail({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = avail
    ? fit === "width" ? avail.w / spec.w : Math.min(avail.w / spec.w, avail.h / spec.h)
    : 0;

  return (
    <div ref={box} className={className} style={fit === "width" ? { aspectRatio: `${spec.w} / ${spec.h}` } : undefined}>
      {scale > 0 && (
        <div className="relative mx-auto overflow-hidden" style={{ width: spec.w * scale, height: spec.h * scale }}>
          <div style={{ width: spec.w, height: spec.h, transform: `scale(${scale})`, transformOrigin: "top right", position: "absolute", top: 0, right: 0 }}>
            <Design ref={ref} {...p} brand={library.brand} backgrounds={library.backgrounds} />
          </div>
        </div>
      )}
    </div>
  );
});
