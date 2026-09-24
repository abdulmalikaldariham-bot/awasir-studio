"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Template } from "@/lib/types";
import { activeTemplates, sampleValues, useLibrary } from "@/lib/library";
import { HexRings } from "@/components/design/parts";
import { Preview } from "@/components/design/Preview";
import { templatesCount } from "@/lib/plural";
import { TemplateCard, TemplateModal } from "@/components/ui/TemplateCard";

const norm = (s: string) => s.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();

export default function Home() {
  const { library } = useLibrary();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Template | null>(null);
  const cats = useMemo(() => [...library.categories].filter((c) => !c.hidden).sort((a, b) => a.order - b.order), [library]);
  const all = activeTemplates(library);
  const featured = all.filter((t) => t.featured).slice(0, 6);
  const results = q.trim()
    ? all.filter((t) => {
        const cat = library.categories.find((c) => c.id === t.category)?.name ?? "";
        return norm(`${t.name} ${cat} ${t.description ?? ""}`).includes(norm(q.trim()));
      })
    : null;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-line bg-white">
        <HexRings stroke="#8CC0C7" count={9} width={1.3}
          className="pointer-events-none absolute -left-40 -top-24 h-[560px] w-[560px] opacity-70 sm:-left-24" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="text-[34px] leading-[1.25] sm:text-[52px] font-extrabold text-navy max-w-2xl">ماذا تريد أن تصمم اليوم؟</h1>
          <p className="mt-4 text-lg text-ink-soft max-w-xl leading-8">اختر المناسبة، اكتب البيانات، وحمّل تصميماً جاهزاً بهوية أواصر خلال دقيقتين.</p>
          <label className="relative mt-8 block max-w-xl">
            <span className="sr-only">ابحث عن قالب</span>
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint" size={20} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث: دعوة زواج، تعزية، رحلة…"
              className="input h-14 pr-12 text-base rounded-2xl shadow-lift" />
          </label>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-14">
        {results ? (
          <section>
            <h2 className="text-xl font-bold text-navy mb-5">{results.length ? `${results.length} نتيجة` : "لا توجد قوالب بهذا الاسم"}</h2>
            {results.length === 0 && <p className="text-ink-soft">جرّب كلمة أقصر، أو تصفح التصنيفات بعد مسح البحث. ويمكنك دائماً استخدام <Link className="text-teal font-semibold underline" href="/c/general">التصميم العام</Link>.</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {results.map((t) => <TemplateCard key={t.id} t={t} onOpen={setOpen} showCategory />)}
            </div>
          </section>
        ) : (
          <>
            {featured.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-navy mb-5">الأكثر استخداماً</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                  {featured.map((t) => <TemplateCard key={t.id} t={t} onOpen={setOpen} showCategory />)}
                </div>
              </section>
            )}
            <section>
              <h2 className="text-xl font-bold text-navy mb-5">التصنيفات</h2>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {cats.map((c) => {
                  const list = activeTemplates(library, c.id);
                  const first = list[0];
                  return (
                    <Link key={c.id} href={`/c/${c.id}`} className="group flex items-center gap-4 rounded-2xl bg-white p-3 ring-1 ring-line transition hover:ring-teal hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal">
                      <div className="w-24 shrink-0 overflow-hidden rounded-xl bg-mist-100">
                        {first ? <Preview template={first} values={sampleValues(first, library)} styleIndex={0} size="portrait" className="w-full" /> : <div className="aspect-[4/5]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-navy text-[17px] leading-7">{c.name}</p>
                        <p className="text-sm text-ink-soft leading-6 line-clamp-2">{c.description}</p>
                        <p className="text-xs text-ink-faint mt-1">{list.length ? templatesCount(list.length) : "لا توجد قوالب بعد"}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
      <TemplateModal t={open} onClose={() => setOpen(null)} />
    </main>
  );
}
