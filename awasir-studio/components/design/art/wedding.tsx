// عناصر الزواج: الدلة والفنجال، الختم، الخاتمان
import { Svg, soft, scallop, hexPath, type ArtProps } from "./base";

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
