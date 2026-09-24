"use client";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { Field, Library, Template, Tone } from "@/lib/types";
import { interpolate } from "@/lib/format";

const TONES: { id: Tone | "custom"; label: string }[] = [
  { id: "formal", label: "رسمية" },
  { id: "family", label: "عائلية" },
  { id: "short", label: "مختصرة" },
  { id: "friendly", label: "ودية" },
  { id: "custom", label: "نص مخصص" },
];

export function FieldsForm({ template, values, onChange, library, missing }: {
  template: Template; values: Record<string, string>; onChange: (k: string, v: string) => void;
  library: Library; missing: Set<string>;
}) {
  return (
    <div className="space-y-5">
      {template.fields.map((f) => (
        <FieldInput key={f.key} f={f} value={values[f.key] ?? ""} onChange={(v) => onChange(f.key, v)}
          template={template} library={library} invalid={missing.has(f.key)} />
      ))}
    </div>
  );
}

function FieldInput({ f, value, onChange, template, library, invalid }: {
  f: Field; value: string; onChange: (v: string) => void; template: Template; library: Library; invalid: boolean;
}) {
  const id = `f-${f.key}`;
  const label = (
    <label htmlFor={id} className="label">
      {f.label}{f.required && <span className="text-teal"> *</span>}
    </label>
  );
  const cls = `input ${invalid ? "!border-amber-500 ring-2 ring-amber-100" : ""}`;
  const placeholder = f.placeholder ?? (f.key === "signature" ? library.brand.signature : "");

  if (f.presets) {
    return (
      <div>
        {label}
        <PresetPicker template={template} library={library} value={value} onPick={onChange} />
        <textarea id={id} className={`${cls} mt-2`} rows={4} value={value} placeholder="اكتب النص أو اختر من النصوص الجاهزة"
          onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (f.type === "textarea") {
    return (
      <div>{label}
        <textarea id={id} className={cls} rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        {f.help && <p className="hint">{f.help}</p>}
      </div>
    );
  }
  if (f.type === "select") {
    return (
      <div>{label}
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={f.label}>
          {(f.options ?? []).map((o) => (
            <button key={o} type="button" role="radio" aria-checked={value === o}
              className={`chip ${value === o ? "chip-on" : ""}`} onClick={() => onChange(o)}>{o}</button>
          ))}
        </div>
      </div>
    );
  }
  if (f.type === "date") {
    const shown = value ? interpolate("{{d|full}}[[ — {{d|gregorian}}]]", { d: value }, library.brand) : "";
    return (
      <div>{label}
        <input id={id} type="date" className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
        <p className="hint">{shown || f.help || "يظهر في التصميم بالهجري والميلادي تلقائياً"}</p>
      </div>
    );
  }
  if (f.type === "url") {
    const bad = value && !/^https?:\/\//i.test(value);
    return (
      <div>{label}
        <input id={id} type="url" dir="ltr" inputMode="url" className={`${cls} text-left`} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.trim())}
          onBlur={() => { if (bad && /\.[a-z]{2,}/i.test(value)) onChange(`https://${value}`); }} />
        <p className={`hint ${bad ? "!text-amber-700" : ""}`}>
          {bad ? "الرابط يجب أن يبدأ بـ https://" : f.qr ? "يظهر في التصميم رمز QR يفتح هذا الرابط" : f.help}
        </p>
      </div>
    );
  }
  return (
    <div>{label}
      <input id={id} type={f.type === "number" ? "number" : "text"} className={cls} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
      {f.help && <p className="hint">{f.help}</p>}
    </div>
  );
}

function PresetPicker({ template, library, value, onPick }: { template: Template; library: Library; value: string; onPick: (v: string) => void }) {
  const group = library.presets.find((p) => p.id === template.presetGroup);
  const [tone, setTone] = useState<Tone | "custom">("formal");
  const texts = useMemo(() => group?.texts.filter((t) => t.tone === tone) ?? [], [group, tone]);
  if (!group) return null;
  return (
    <div className="rounded-xl bg-mist-50 ring-1 ring-line p-3">
      <p className="text-xs font-semibold text-ink-soft mb-2">اختر صيغة النص</p>
      <div className="flex flex-wrap gap-1.5">
        {TONES.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTone(t.id); if (t.id === "custom") onPick(""); }}
            className={`chip !h-8 !px-3 !text-[13px] ${tone === t.id ? "chip-on" : ""}`}>{t.label}</button>
        ))}
      </div>
      {tone !== "custom" && (
        <div className="mt-3 space-y-2">
          {texts.length === 0 && <p className="text-sm text-ink-faint">لا توجد نصوص بهذه الصيغة بعد.</p>}
          {texts.map((t, i) => {
            const on = value === t.text;
            return (
              <button key={i} type="button" onClick={() => onPick(t.text)}
                className={`w-full text-start rounded-lg px-3 py-2.5 text-[14px] leading-7 transition flex gap-2 ${on ? "bg-navy text-white" : "bg-white ring-1 ring-line hover:ring-teal text-ink"}`}>
                <span className="flex-1">{t.text}</span>
                {on && <Check size={18} className="shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>
      )}
      {tone === "custom" && <p className="mt-2 text-sm text-ink-soft">اكتب نصك في المربع أدناه.</p>}
    </div>
  );
}
