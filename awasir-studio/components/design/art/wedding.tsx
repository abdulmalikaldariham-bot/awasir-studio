// عناصر الزواج: البشت (المشلح)، الدلة والفنجال، الختم، الخاتمان
import { Svg, soft, scallop, hexPath, type ArtProps } from "./base";

/** البشت السعودي من الأمام، بحواشي الزري الذهبية */
export function Bisht(p: ArtProps) {
  const body = "M50 10C45 10 41 11 38 13C30 16 20 20 13 26C7 32 4 44 3 58L2 76C6 78 11 78 15 76L13 105C30 108 70 108 87 105L85 76C89 78 94 78 98 76L97 58C96 44 93 32 87 26C80 20 70 16 62 13C59 11 55 10 50 10Z";
  const zariL = "M38 13.5L42.5 13L40.2 66L35.4 66Z";
  const zariR = "M62 13.5L57.5 13L59.8 66L64.6 66Z";
  const dots = Array.from({ length: 8 }, (_, i) => 18 + i * 6);
  return (
    <Svg vb="0 0 100 110" {...p}>
      <path d={body} {...soft} />
      {/* الثوب الظاهر من فتحة البشت */}
      <path d="M42.5 13C45 17 47 19 50 19.5C53 19 55 17 57.5 13L60.5 106C54 107 46 107 39.5 106Z" fill="currentColor" fillOpacity={0.05} />
      {/* ثنيات القماش */}
      <path d="M27 40C26 60 24.5 82 23.5 104M73 40C74 60 75.5 82 76.5 104M33 70C32.5 82 32 94 31.5 105M67 70C67.5 82 68 94 68.5 105" strokeOpacity={0.45} strokeWidth={1.1} />
      {/* الزري */}
      <path d={zariL} fill="currentColor" fillOpacity={0.85} stroke="none" />
      <path d={zariR} fill="currentColor" fillOpacity={0.85} stroke="none" />
      <path d="M34.8 66L34 72M65.2 66L66 72" strokeWidth={1.2} />
      {dots.map((y) => (
        <g key={y} strokeWidth={0.7}>
          <path d={`M${37.6 - (y - 18) * 0.045} ${y}l1.6 2.2l-1.6 2.2l-1.6-2.2z`} fill="currentColor" stroke="none" fillOpacity={0.35} />
          <path d={`M${62.4 + (y - 18) * 0.045} ${y}l1.6 2.2l-1.6 2.2l-1.6-2.2z`} fill="currentColor" stroke="none" fillOpacity={0.35} />
        </g>
      ))}
      <path d="M38 13C42 21 58 21 62 13" strokeWidth={2.4} />
      {/* فتحتا اليدين */}
      <path d="M17 36L18 72M83 36L82 72" strokeWidth={2.2} />
      <path d="M40.2 66L39.5 106M59.8 66L60.5 106" />
      <path d={body} />
    </Svg>
  );
}

/** الدلة مع فنجال */
export function Dallah(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M36 90C27 78 29 66 39 60L41 52C37 48 39 43 43 42L57 42C61 43 63 48 59 52L61 60C71 66 73 78 64 90Z" {...soft} />
      <path d="M36 90C27 78 29 66 39 60L41 52C37 48 39 43 43 42L57 42C61 43 63 48 59 52L61 60C71 66 73 78 64 90Z" />
      <path d="M33 90H67L69 94H31Z" {...soft} />
      <path d="M40.5 56H59.5M38 70H62" strokeOpacity={0.5} />
      <path d="M43 42C44 33 47 29 50 28C53 29 56 33 57 42" {...soft} />
      <path d="M50 28V23M50 20.5a2.5 2.5 0 1 0 0.01 0" />
      {/* الصنبور */}
      <path d="M62 63C74 62 79 54 83 44L91 33L87 47C83 62 76 68 64 71" {...soft} />
      {/* المقبض */}
      <path d="M40 47C22 47 20 62 25 72C28 78 32 81 35 83" strokeWidth={2} />
      {/* الفنجال */}
      <path d="M7 80H23L21 90C20 92 10 92 9 90Z" {...soft} />
      <path d="M5 93H25" />
    </Svg>
  );
}

/** ختم شمعي بالنمط السداسي */
export function Seal(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d={scallop(50, 50, 44, 18, 3.2)} {...soft} />
      <path d={scallop(50, 50, 44, 18, 3.2)} />
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="29" strokeOpacity={0.5} strokeWidth={0.9} />
      <path d={hexPath(50, 50, 16)} strokeWidth={2} />
      <path d={hexPath(50, 50, 9)} {...soft} />
    </Svg>
  );
}

/** خاتمان متشابكان */
export function RingsPair(p: ArtProps) {
  return (
    <Svg vb="0 0 100 80" {...p} sw={2.4}>
      <circle cx="38" cy="48" r="22" />
      <circle cx="62" cy="48" r="22" />
      <path d="M38 26l-6-8h12z" {...soft} />
      <path d="M38 26l-6-8h12z" strokeWidth={1.6} />
      <path d="M32 18l6-6l6 6" strokeWidth={1.6} />
    </Svg>
  );
}
