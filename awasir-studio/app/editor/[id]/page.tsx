"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Save, Check } from "lucide-react";
import type { Custom, Draft, SizeId } from "@/lib/types";
import { DEFAULT_CUSTOM, SIZES, SIZE_ORDER } from "@/lib/design";
import { sampleValues, useLibrary } from "@/lib/library";
import { bumpUsage, drafts, newId } from "@/lib/drafts";
import { Preview } from "@/components/design/Preview";
import { FieldsForm } from "@/components/editor/FieldsForm";
import { Customize } from "@/components/editor/Customize";
import { ExportBar } from "@/components/editor/ExportBar";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Suspense><Editor templateId={id} /></Suspense>;
}

function Editor({ templateId }: { templateId: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const { library, ready } = useLibrary();
  const template = library.templates.find((t) => t.id === templateId);

  const [values, setValues] = useState<Record<string, string>>({});
  const [styleIndex, setStyleIndex] = useState(Number(sp.get("style") ?? 0) || 0);
  const [size, setSize] = useState<SizeId>("portrait");
  const [custom, setCustom] = useState<Custom>(DEFAULT_CUSTOM);
  const [tab, setTab] = useState<"data" | "custom">("data");
  const [draft, setDraft] = useState<{ id: string; createdAt: string } | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const designRef = useRef<HTMLDivElement>(null);

  // تحميل مسودة موجودة، أو بدء تصميم جديد بالنص الجاهز الأول
  useEffect(() => {
    if (!template || loaded) return;
    const draftId = sp.get("draft");
    const copy = sp.get("copy") === "1";
    (async () => {
      const d = draftId ? await drafts.get(draftId) : undefined;
      if (d && d.templateId === template.id) {
        setValues(d.values); setStyleIndex(Math.min(d.styleIndex, template.styles.length - 1)); setSize(d.size);
        setCustom({ ...DEFAULT_CUSTOM, ...d.custom });
        if (copy) { setName(`${d.name} (نسخة)`); } else { setDraft({ id: d.id, createdAt: d.createdAt }); setName(d.name); }
      } else {
        const init: Record<string, string> = { ...template.defaults };
        const tf = template.fields.find((f) => f.presets);
        const first = library.presets.find((p) => p.id === template.presetGroup)?.texts[0]?.text;
        if (tf && first && !init[tf.key]) init[tf.key] = first;
        setValues(init);
        setName(template.name);
      }
      setLoaded(true);
    })();
  }, [template, loaded, sp, library.presets]);

  const missing = useMemo(
    () => (template ? template.fields.filter((f) => f.required && !(values[f.key] ?? "").trim()) : []),
    [template, values],
  );

  const persist = useCallback(async () => {
    if (!template) return;
    setSaved("saving");
    const now = new Date().toISOString();
    const d: Draft = {
      id: draft?.id ?? newId(), templateId: template.id, name: name.trim() || template.name,
      values, styleIndex, size, custom, createdAt: draft?.createdAt ?? now, updatedAt: now,
    };
    try {
      await drafts.save(d);
      if (!draft) {
        setDraft({ id: d.id, createdAt: d.createdAt });
        router.replace(`/editor/${template.id}?draft=${d.id}`, { scroll: false });
      }
      setSaved("saved");
    } catch {
      setSaved("idle");
      alert("تعذر الحفظ. قد تكون مساحة المتصفح ممتلئة، احذف بعض المسودات القديمة ثم أعد المحاولة.");
    }
  }, [template, draft, name, values, styleIndex, size, custom, router]);

  // بعد أول حفظ: حفظ تلقائي عند كل تعديل
  const first = useRef(true);
  useEffect(() => {
    if (!draft) return;
    if (first.current) { first.current = false; return; }
    setSaved("idle");
    const t = setTimeout(persist, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, styleIndex, size, custom, name]);

  if (ready && !template) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">هذا القالب غير متاح</h1>
        <p className="text-ink-soft mt-2">ربما أوقفه مدير النظام أو حذفه. مسوداتك محفوظة ويمكنك اختيار قالب آخر.</p>
        <Link href="/" className="btn-primary mt-6">اختر قالباً</Link>
      </main>
    );
  }
  if (!template || !loaded) return <div className="min-h-dvh grid place-items-center text-ink-faint">جارٍ التحميل…</div>;

  const cat = library.categories.find((c) => c.id === template.category);
  const thumbValues = { ...sampleValues(template, library), ...Object.fromEntries(Object.entries(values).filter(([, v]) => v)) };

  return (
    <div className="min-h-dvh flex flex-col">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-30 bg-white border-b border-line">
        <div className="h-16 px-3 sm:px-5 flex items-center gap-3">
          <Link href={cat ? `/c/${cat.id}` : "/"} className="btn-ghost btn-sm !px-2" aria-label="رجوع"><ChevronRight size={18} /></Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.svg" alt="" className="h-7 w-auto hidden sm:block" />
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="اسم التصميم"
            className="min-w-0 flex-1 max-w-sm bg-transparent text-[17px] font-bold text-navy rounded-lg px-2 h-10 hover:bg-mist-50 focus:bg-mist-50 focus:outline-none focus:ring-2 focus:ring-mist" />
          <span className="text-sm text-ink-faint hidden md:inline">{template.name}</span>
          <div className="ms-auto flex items-center gap-2">
            {draft ? (
              <span className="text-sm text-ink-soft inline-flex items-center gap-1.5">
                {saved === "saving" ? "جارٍ الحفظ…" : saved === "saved" ? <><Check size={16} className="text-teal" />محفوظ في مسوداتي</> : "تعديلات لم تُحفظ"}
              </span>
            ) : (
              <button type="button" onClick={persist} className="btn-ghost btn-sm"><Save size={16} />حفظ في مسوداتي</button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[440px_1fr]">
        {/* يمين: البيانات والتخصيص */}
        <aside className="order-2 lg:order-1 bg-white lg:border-l border-line lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-line px-5 pt-4">
            <div className="flex gap-6" role="tablist">
              {([["data", "البيانات"], ["custom", "تخصيص التصميم"]] as const).map(([id, label]) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                  className={`pb-3 text-[15px] font-bold border-b-2 transition ${tab === id ? "border-teal text-navy" : "border-transparent text-ink-faint hover:text-navy"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5 pb-16">
            {tab === "data" ? (
              <FieldsForm template={template} values={values} library={library} missing={new Set()}
                onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))} />
            ) : (
              <Customize template={template} styleIndex={styleIndex} custom={custom} onChange={setCustom} library={library} />
            )}
          </div>
        </aside>

        {/* يسار: المعاينة */}
        <section className="order-1 lg:order-2 bg-mist-50 p-4 sm:p-6 flex flex-col gap-4 lg:h-[calc(100dvh-4rem)] lg:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-soft me-1">الشكل</span>
            {template.styles.map((s, i) => (
              <button key={i} type="button" onClick={() => { setStyleIndex(i); setCustom((c) => ({ ...c, theme: undefined, accent: undefined })); }}
                className={`group flex items-center gap-2 rounded-xl pe-3 ps-1 h-11 ring-1 transition ${i === styleIndex ? "bg-navy text-white ring-navy" : "bg-white ring-line hover:ring-teal"}`}>
                <span className="h-9 w-9 overflow-hidden rounded-lg">
                  <Preview template={template} values={thumbValues} styleIndex={i} size="post" className="w-9" />
                </span>
                <span className="text-sm font-semibold">{s.label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink-soft me-1">المقاس</span>
            {SIZE_ORDER.filter((s) => template.sizes.includes(s)).map((s) => (
              <button key={s} type="button" onClick={() => setSize(s)} title={SIZES[s].hint}
                className={`chip !h-9 ${size === s ? "chip-on" : ""}`}>{SIZES[s].name}</button>
            ))}
          </div>

          <div className="relative flex-1 min-h-[52dvh] rounded-2xl bg-white/60 ring-1 ring-line">
            <Preview ref={designRef} template={template} values={values} styleIndex={styleIndex} size={size} custom={custom}
              fit="contain" className="absolute inset-4 sm:inset-6 [&>div]:shadow-lift" />
          </div>

          <ExportBar getNode={() => designRef.current} size={size} name={name || template.name}
            missing={missing.map((f) => f.label)} onExported={() => bumpUsage(template.id)} />
        </section>
      </div>
    </div>
  );
}
