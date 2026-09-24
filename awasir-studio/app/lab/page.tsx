"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { SizeId } from "@/lib/types";
import { sampleValues, useLibrary } from "@/lib/library";
import { Preview } from "@/components/design/Preview";

/** صفحة مراجعة داخلية: كل القوالب بكل أشكالها في مقاس واحد. /lab?size=story&t=wedding-invite */
function Lab() {
  const sp = useSearchParams();
  const size = (sp.get("size") ?? "post") as SizeId;
  const only = sp.get("t");
  const { library } = useLibrary();
  const list = library.templates.filter((t) => !only || only.split(",").includes(t.id));
  return (
    <main className="p-6 space-y-8">
      {list.map((t) => (
        <section key={t.id}>
          <h2 className="font-bold text-navy mb-2">{t.name} <span className="text-ink-faint text-sm">{t.id}</span></h2>
          <div className="flex flex-wrap gap-4">
            {t.styles.map((s, i) => (
              <div key={i} className="w-[300px]">
                <Preview template={t} values={sampleValues(t, library)} styleIndex={i} size={size} className="w-full" />
                <p className="text-xs text-ink-faint mt-1">{s.label} · {s.style} · {s.theme}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
export default function LabPage() { return <Suspense><Lab /></Suspense>; }
