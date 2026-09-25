"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronRight, ChevronDown, Save, Check, Download, ArrowDown } from "lucide-react";
import type { Custom, Draft, SizeId } from "@/lib/types";
import { DEFAULT_CUSTOM, SIZES, SIZE_ORDER } from "@/lib/design";
import { useLibrary } from "@/lib/library";
import { bumpUsage, drafts, newId } from "@/lib/drafts";
import { Preview } from "@/components/design/Preview";
import { FieldsForm } from "@/components/editor/FieldsForm";
import { Customize } from "@/components/editor/Customize";
import { ExportBar } from "@/components/editor/ExportBar";
import { Thumb } from "@/components/ui/Thumb";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Suspense><Editor templateId={id} /></Suspense>;
}

/**
 * رحلة إنشاء التصميم بالترتيب:
 * ١ البيانات ← ٢ المعاينة المباشرة ← ٣ الشكل والمقاس ← ٤ التخصيص (اختياري) ← ٥ تحميل التصميم
 * على الكمبيوتر تبقى المعاينة ثابتة بجانب الخطوات.
 */
function Editor({ templateId }: { templateId: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const { library, ready } = useLibrary();
  const template = library.templates.find((t) => t.id === templateId);

  const [values, setValues] = useState<Record<string, string>>({});
  const [styleIndex, setStyleIndex] = useState(Number(sp.get("style") ?? 0) || 0);
  const [size, setSize] = useState<SizeId>("portrait");
  const [custom, setCustom] = useState<Custom>(DEFAULT_CUSTOM);
  const [draft, setDraft] = useState<{ id: string; createdAt: string } | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const designRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // المعاينة تتبع الكتابة بأولوية أقل: الحقل يستجيب فوراً، والتصميم يُحدَّث دون أن يعطّل الكتابة
  const previewValues = useDeferredValue(values);
  const previewCustom = useDeferredValue(custom);

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

  const onField = useCallback((k: string, v: string) => setValues((s) => ({ ...s, [k]: v })), []);

  const openExport = () => {
    setExportOpen(true);
    requestAnimationFrame(() => exportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (ready && !template) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">هذا القالب غير متاح</h1>
        <p className="text-ink-soft mt-2">ربما أوقفه مدير النظام أو حذفه. مسوداتك محفوظة ويمكنك اختيار قالب آخر.</p>
        <Link href="/" className="btn-primary mt-6">اختر قالباً</Link>
      </main>
    );
  }
  if (!template || !loaded) return <EditorSkeleton />;

  const cat = library.categories.find((c) => c.id === template.category);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-30 bg-white border-b border-line">
        <div className="h-16 px-3 sm:px-5 flex items-center gap-3">
          <Link href={cat ? `/c/${cat.id}` : "/"} className="btn-ghost btn-sm !px-2" aria-label="رجوع"><ChevronRight size={18} /></Link>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/awaser/mark.svg" alt="" className="h-7 w-auto hidden sm:block" />
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="اسم التصميم"
            className="min-w-0 flex-1 max-w-sm bg-transparent text-[17px] font-bold text-navy rounded-lg px-2 h-10 hover:bg-mist-50 focus:bg-mist-50 focus:outline-none focus:ring-2 focus:ring-mist" />
          <span className="text-sm text-ink-faint hidden md:inline">{template.name}</span>
          <div className="ms-auto flex items-center gap-2">
            {draft ? (
              <span className="text-sm text-ink-soft inline-flex items-center gap-1.5">
                {saved === "saving" ? "جارٍ الحفظ…" : saved === "saved" ? <><Check size={16} className="text-teal" /><span className="hidden sm:inline">محفوظ في مسوداتي</span><span className="sm:hidden">محفوظ</span></> : "تعديلات لم تُحفظ"}
              </span>
            ) : (
              <button type="button" onClick={persist} className="btn-ghost btn-sm"><Save size={16} /><span className="hidden sm:inline">حفظ في مسوداتي</span><span className="sm:hidden">حفظ</span></button>
            )}
          </div>
        </div>
      </header>

      <div className="editor-grid flex-1">
        {/* ١) البيانات */}
        <Step n={1} title="اكتب البيانات" hint="كل ما تكتبه يظهر في المعاينة مباشرة." area="data">
          <FieldsForm template={template} values={values} library={library} missing={new Set()} onChange={onField} />
          <a href="#step-options" className="btn-ghost w-full mt-6 lg:hidden"><ArrowDown size={16} />شاهد المعاينة واختر الشكل</a>
        </Step>

        {/* ٢) المعاينة المباشرة */}
        <section className="[grid-area:prev] bg-mist-50 lg:border-r border-line" aria-label="المعاينة المباشرة">
          <div className="lg:sticky lg:top-16 lg:h-[calc(100dvh-4rem)] p-4 sm:p-6 flex flex-col gap-3">
            <StepLabel n={2} title="المعاينة المباشرة" />
            <div className="relative w-full aspect-[var(--ar)] max-h-[78dvh] lg:max-h-none lg:aspect-auto lg:flex-1 lg:min-h-0 rounded-2xl bg-white/60 ring-1 ring-line"
              style={{ "--ar": `${SIZES[size].w + 60} / ${SIZES[size].h + 60}` } as React.CSSProperties}>
              <Preview ref={designRef} template={template} values={previewValues} styleIndex={styleIndex} size={size} custom={previewCustom}
                fit="contain" className="absolute inset-3 sm:inset-6 [&>div]:shadow-lift" />
            </div>
            <p className="text-xs text-ink-faint text-center tabular-nums">{SIZES[size].name} · {SIZES[size].hint}</p>
          </div>
        </section>

        {/* ٣) الشكل والمقاس */}
        <Step n={3} title="اختر الشكل والمقاس" area="opts" id="step-options">
          <p className="text-sm font-semibold text-ink-soft mb-2">الشكل</p>
          <div className="grid grid-cols-3 gap-2.5">
            {template.styles.map((s, i) => (
              <button key={i} type="button" aria-pressed={i === styleIndex}
                onClick={() => { setStyleIndex(i); setCustom((c) => ({ ...c, theme: undefined, accent: undefined })); }}
                className={`text-start rounded-xl p-1.5 ring-2 transition ${i === styleIndex ? "ring-teal bg-white" : "ring-line hover:ring-mist bg-white"}`}>
                <Thumb t={template} style={i} sizes="130px" className="w-full rounded-lg" />
                <span className={`block text-sm mt-1.5 px-0.5 truncate ${i === styleIndex ? "font-bold text-navy" : "text-ink-soft"}`}>{s.label}</span>
              </button>
            ))}
          </div>
          <p className="text-sm font-semibold text-ink-soft mt-5 mb-2">المقاس</p>
          <div className="flex flex-wrap gap-2">
            {SIZE_ORDER.filter((s) => template.sizes.includes(s)).map((s) => (
              <button key={s} type="button" onClick={() => setSize(s)} title={SIZES[s].hint}
                className={`chip !h-9 ${size === s ? "chip-on" : ""}`}>{SIZES[s].name}</button>
            ))}
          </div>
        </Step>

        {/* ٤) التخصيص (اختياري) */}
        <section className="[grid-area:cust] bg-white border-t border-line">
          <button type="button" onClick={() => setCustomOpen((o) => !o)} aria-expanded={customOpen}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start hover:bg-mist-50/60">
            <span><StepLabel n={4} title="التخصيص" /><span className="block text-sm text-ink-faint mt-0.5 ms-9">اختياري: الألوان، الخلفية، الشعار، الصورة، إظهار العناصر</span></span>
            <ChevronDown size={20} className={`text-ink-faint transition ${customOpen ? "rotate-180" : ""}`} />
          </button>
          {customOpen && (
            <div className="px-5 pb-6">
              <Customize template={template} styleIndex={styleIndex} custom={custom} onChange={setCustom} library={library} />
            </div>
          )}
        </section>

        {/* ٥) تحميل التصميم: آخر خطوة */}
        <section ref={exportRef} className="[grid-area:exp] bg-white border-t border-line p-5 pb-10 scroll-mt-20">
          <StepLabel n={5} title="تحميل التصميم" />
          {!exportOpen ? (
            <div className="mt-3 rounded-2xl bg-mist-50 ring-1 ring-line p-4">
              <p className="text-sm text-ink-soft leading-6">
                {missing.length > 0
                  ? <>أكمل الحقول المطلوبة أولاً: <strong className="text-navy">{missing.map((f) => f.label).join("، ")}</strong></>
                  : "راجع المعاينة، وعندما يصبح التصميم جاهزاً انتقل إلى التحميل."}
              </p>
              <button type="button" onClick={openExport} className="btn-primary w-full mt-3 h-12 text-base">
                <Download size={18} />انتهيت، جهّز التصميم للتحميل
              </button>
            </div>
          ) : (
            <ExportBar getNode={() => designRef.current} size={size} name={name || template.name}
              missing={missing.map((f) => f.label)} onExported={() => bumpUsage(template.id)} />
          )}
        </section>
      </div>
    </div>
  );
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-white text-sm font-bold tabular-nums">{n.toLocaleString("ar-SA")}</span>
      <span className="text-[17px] font-bold text-navy">{title}</span>
    </span>
  );
}

function Step({ n, title, hint, area, id, children }: { n: number; title: string; hint?: string; area: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="bg-white p-5 border-t border-line first:border-t-0 scroll-mt-20" style={{ gridArea: area }}>
      <StepLabel n={n} title={title} />
      {hint && <p className="text-sm text-ink-faint mt-1 ms-9">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EditorSkeleton() {
  return (
    <div className="min-h-dvh flex flex-col">
      <div className="h-16 border-b border-line bg-white" />
      <div className="editor-grid flex-1">
        <div className="bg-white p-5 space-y-4" style={{ gridArea: "data" }}>
          {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-11 rounded-xl" />)}
        </div>
        <div className="bg-mist-50 p-6" style={{ gridArea: "prev" }}>
          <div className="skeleton mx-auto aspect-[4/5] max-h-[70dvh] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
