"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { Template } from "@/lib/types";
import { sampleValues, useLibrary } from "@/lib/library";
import { PreviewOnDemand as Preview } from "@/components/design/PreviewOnDemand";
import { Thumb } from "./Thumb";

export function TemplateCard({ t, onOpen, showCategory, priority }: { t: Template; onOpen: (t: Template) => void; showCategory?: boolean; priority?: boolean }) {
  const { library } = useLibrary();
  const cat = library.categories.find((c) => c.id === t.category);
  return (
    <button onClick={() => onOpen(t)} className="group text-start focus-visible:outline-none">
      <div className="rounded-2xl bg-white p-2 ring-1 ring-line transition group-hover:ring-teal group-hover:shadow-lift group-focus-visible:ring-2 group-focus-visible:ring-teal">
        <Thumb t={t} className="w-full rounded-xl" priority={priority} />
      </div>
      <div className="px-1 pt-2.5">
        <p className="font-bold text-navy leading-6">{t.name}</p>
        <p className="text-sm text-ink-faint">{showCategory && cat ? cat.name : `${t.styles.length} ${t.styles.length > 10 ? "شكلاً" : "أشكال"}`}</p>
      </div>
    </button>
  );
}

/** نافذة معاينة القالب: يختار المستخدم الشكل ثم يبدأ */
export function TemplateModal({ t, onClose }: { t: Template | null; onClose: () => void }) {
  const { library } = useLibrary();
  const [style, setStyle] = useState(0);
  useEffect(() => setStyle(0), [t]);
  useEffect(() => {
    if (!t) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [t, onClose]);
  const values = useMemo(() => (t ? sampleValues(t, library) : {}), [t, library]);
  if (!t) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-navy/50 p-0 sm:p-6" onClick={onClose} role="dialog" aria-modal aria-label={t.name}>
      <div className="w-full sm:max-w-4xl max-h-[92dvh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-mist-50 p-5 sm:p-7" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-navy">{t.name}</h2>
            {t.description && <p className="text-ink-soft mt-1">{t.description}</p>}
          </div>
          <button onClick={onClose} className="btn-ghost btn-sm !px-2" aria-label="إغلاق"><X size={18} /></button>
        </div>
        <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
          <div className="rounded-2xl bg-white p-3 ring-1 ring-line">
            <Preview template={t} values={values} styleIndex={style} size="portrait" fit="contain" className="w-full h-[52dvh] sm:h-[60dvh]" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-ink-soft">اختر الشكل</p>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-3">
              {t.styles.map((s, i) => (
                <button key={i} onClick={() => setStyle(i)} className="text-start">
                  <div className={`rounded-xl p-1 ring-2 transition ${i === style ? "ring-teal bg-white" : "ring-transparent hover:ring-line"}`}>
                    <Thumb t={t} style={i} sizes="110px" className="w-full rounded-lg" />
                  </div>
                  <p className={`text-sm mt-1 px-1 ${i === style ? "font-bold text-navy" : "text-ink-soft"}`}>{s.label}</p>
                </button>
              ))}
            </div>
            <Link href={`/editor/${t.id}?style=${style}`} className="btn-primary mt-auto">ابدأ التصميم</Link>
            <p className="text-xs text-ink-faint">يمكنك تغيير الشكل والمقاس لاحقاً دون أن تفقد ما كتبته.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
