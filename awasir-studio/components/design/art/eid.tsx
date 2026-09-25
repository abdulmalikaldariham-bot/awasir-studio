// عناصر العيدين: الهدايا، الإشراقة، النجمة الثمانية، أفق المسجد
import { Svg, soft, sparkle, star8, type ArtProps } from "./base";

/** صندوقا هدايا هندسيان */
export function Gift(p: ArtProps) {
  return (
    <Svg vb="0 0 110 100" {...p}>
      {/* الكبير */}
      <path d="M8 44H64V96H8Z" {...soft} />
      <path d="M8 44H64V96H8Z" />
      <path d="M4 34H68V44H4Z" fill="currentColor" fillOpacity={0.25} />
      <path d="M4 34H68V44H4Z" />
      <path d="M36 34V96" strokeWidth={4} strokeOpacity={0.8} />
      <path d="M36 34C28 20 16 20 18 28C20 34 30 34 36 34C42 34 52 34 54 28C56 20 44 20 36 34Z" />
      {/* الصغير */}
      <path d="M72 66H104V96H72Z" {...soft} />
      <path d="M72 66H104V96H72Z" />
      <path d="M70 60H106V66H70Z" fill="currentColor" fillOpacity={0.25} />
      <path d="M70 60H106V66H70Z" />
      <path d="M88 60V96" strokeWidth={3} strokeOpacity={0.8} />
      <path d="M88 60C84 52 78 52 79 56C80 60 85 60 88 60C91 60 96 60 97 56C98 52 92 52 88 60Z" />
      <path d={sparkle(90, 22, 8)} fill="currentColor" stroke="none" />
      <path d={sparkle(104, 40, 4)} fill="currentColor" stroke="none" fillOpacity={0.7} />
    </Svg>
  );
}

/** إشراقة احتفالية */
export function Burst(p: ArtProps) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 16;
    const r1 = 22, r2 = i % 2 ? 36 : 44;
    return `M${(50 + r1 * Math.cos(a)).toFixed(1)} ${(50 + r1 * Math.sin(a)).toFixed(1)}L${(50 + r2 * Math.cos(a)).toFixed(1)} ${(50 + r2 * Math.sin(a)).toFixed(1)}`;
  }).join("");
  return (
    <Svg vb="0 0 100 100" {...p} sw={2}>
      <path d={rays} />
      <path d={star8(50, 50, 13)} {...soft} />
      <path d={star8(50, 50, 13)} />
    </Svg>
  );
}

/** النجمة الثمانية (زخرفة إسلامية) */
export function Star8(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d={star8(50, 50, 44)} {...soft} />
      <path d={star8(50, 50, 44)} />
      <path d={star8(50, 50, 32)} strokeOpacity={0.6} />
      <circle cx="50" cy="50" r="14" />
      <path d={sparkle(50, 50, 8)} fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** أفق مسجد: قباب ومآذن (شريط عريض) */
export function Mosque(p: ArtProps) {
  const minaret = (x: number, top: number) =>
    `M${x - 4} 100V${top + 18}L${x - 5} ${top + 16}H${x + 5}L${x + 4} ${top + 18}V100M${x - 3.5} ${top + 16}V${top + 8}H${x + 3.5}V${top + 16}M${x - 3.5} ${top + 8}Q${x} ${top - 2} ${x} ${top - 6}Q${x} ${top - 2} ${x + 3.5} ${top + 8}`;
  const dome = (x: number, w: number, base: number) =>
    `M${x - w} ${base}C${x - w} ${base - w * 1.1} ${x - w * 0.2} ${base - w * 1.25} ${x} ${base - w * 1.55}C${x + w * 0.2} ${base - w * 1.25} ${x + w} ${base - w * 1.1} ${x + w} ${base}Z`;
  return (
    <Svg vb="0 0 400 100" {...p} sw={1.4}>
      <path d={`M0 100V86H130V74H270V86H400V100Z`} {...soft} />
      <path d={dome(200, 44, 74)} {...soft} />
      <path d={dome(200, 44, 74)} />
      <path d="M200 6V-2" />
      <path d={dome(150, 18, 86)} {...soft} />
      <path d={dome(150, 18, 86)} />
      <path d={dome(250, 18, 86)} {...soft} />
      <path d={dome(250, 18, 86)} />
      <path d={minaret(104, 20)} {...soft} />
      <path d={minaret(104, 20)} />
      <path d={minaret(296, 20)} {...soft} />
      <path d={minaret(296, 20)} />
      <path d="M0 86H130V74H270V86H400" />
      {[142, 158, 172, 186, 214, 228, 242, 258].map((x) => (
        <path key={x} d={`M${x - 3} 100V93Q${x} 88 ${x + 3} 93V100`} strokeOpacity={0.6} strokeWidth={1} />
      ))}
      <path d="M0 100H400" />
    </Svg>
  );
}
