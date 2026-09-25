"use client";
import { useEffect } from "react";
import { sampleValues, useLibrary } from "@/lib/library";
import { thumbDir, thumbKey } from "@/lib/thumbs";
import { Design } from "@/components/design/Design";

/** صفحة داخلية يستخدمها scripts/thumbs.mjs لتصوير الصور المصغرة. لا يحتاجها المستخدم. */
export default function ThumbsLab() {
  const { library } = useLibrary();
  const list = library.templates;
  useEffect(() => {
    (window as unknown as { __thumbs: unknown }).__thumbs = list.map((t) => ({ id: t.id, n: t.styles.length, k: thumbKey(t, library), dir: thumbDir(t) }));
  }, [list, library]);
  return (
    <main style={{ width: 1080 }}>
      {list.flatMap((t) => t.styles.map((_, i) => (
        <div key={`${t.id}-${i}`} data-thumb={`${t.id}-${i}`} style={{ width: 1080, height: 1350 }}>
          <Design template={t} values={sampleValues(t, library)} styleIndex={i} size="portrait" brand={library.brand} backgrounds={library.backgrounds} />
        </div>
      )))}
    </main>
  );
}
