"use client";
import { ART, ART_NAMES } from "@/components/design/art";
import type { ArtId } from "@/lib/occasions";

/** مراجعة داخلية لكل العناصر البصرية على خلفية داكنة وفاتحة */
export default function ArtLab() {
  return (
    <main className="p-6 grid grid-cols-6 gap-4">
      {(Object.keys(ART) as ArtId[]).map((id) => {
        const C = ART[id];
        return (
          <div key={id} className="rounded-xl overflow-hidden ring-1 ring-line">
            <div className="grid grid-cols-2">
              <div className="p-4 bg-[#1C3F4E] text-[#C9A45C] h-40 grid place-items-center"><C className="max-h-32 max-w-full" /></div>
              <div className="p-4 bg-white text-[#336D6E] h-40 grid place-items-center"><C className="max-h-32 max-w-full" /></div>
            </div>
            <p className="text-sm p-2">{ART_NAMES[id]} · {id}</p>
          </div>
        );
      })}
    </main>
  );
}
