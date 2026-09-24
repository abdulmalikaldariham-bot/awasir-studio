"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportDesign, type ExportFormat, type ExportQuality } from "@/lib/export";
import { SIZES } from "@/lib/design";
import type { SizeId } from "@/lib/types";

export function ExportBar({ getNode, size, name, missing, onExported }: {
  getNode: () => HTMLElement | null; size: SizeId; name: string; missing: string[]; onExported?: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<ExportQuality>("high");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const spec = SIZES[size];
  const px = quality === "high" ? 2 : 1;

  const run = async () => {
    const node = getNode();
    if (!node) return;
    setBusy(true); setMsg(null);
    try {
      await exportDesign(node, format, quality, size, name);
      setMsg({ ok: true, text: "تم تحميل التصميم" });
      onExported?.();
    } catch (e) {
      console.error(e);
      setMsg({ ok: false, text: "تعذر تجهيز الملف. جرّب الجودة العادية، أو صورة أصغر حجماً." });
    } finally { setBusy(false); }
  };

  return (
    <div className="panel p-4">
      {missing.length > 0 && (
        <p className="mb-3 rounded-lg bg-amber-50 text-amber-800 text-sm px-3 py-2 leading-6">
          حقول مطلوبة لم تُكتب بعد: {missing.join("، ")}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Seg value={format} onChange={setFormat} options={[["png", "PNG"], ["jpg", "JPG"], ["pdf", "PDF"]]} label="صيغة الملف" />
        <Seg value={quality} onChange={setQuality} options={[["normal", "جودة عادية"], ["high", "جودة عالية"]]} label="الجودة" />
        <button type="button" onClick={run} disabled={busy} className="btn-primary sm:ms-auto min-w-40">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {busy ? "جارٍ التجهيز…" : "تحميل التصميم"}
        </button>
      </div>
      <p className="text-xs text-ink-faint mt-2 tabular-nums" dir="rtl">
        {format === "pdf" && size === "a4" ? "ملف PDF بمقاس A4 جاهز للطباعة" : `${spec.w * px} × ${spec.h * px} بكسل`}
        {msg && <span className={`ms-3 font-semibold ${msg.ok ? "text-teal" : "text-amber-700"}`}>{msg.text}</span>}
      </p>
    </div>
  );
}

function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: [T, string][]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl bg-mist-50 ring-1 ring-line p-1">
      {options.map(([id, name]) => (
        <button key={id} type="button" role="radio" aria-checked={value === id} onClick={() => onChange(id)}
          className={`h-9 px-3 rounded-lg text-sm font-semibold transition ${value === id ? "bg-white text-navy shadow-sm ring-1 ring-line" : "text-ink-soft hover:text-navy"}`}>
          {name}
        </button>
      ))}
    </div>
  );
}
