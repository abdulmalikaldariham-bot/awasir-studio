// الاجتماعات العائلية، الدورات والبرامج، الرحلات، المسابقات، الإعلانات
import { Svg, soft, sparkle, hexPath, star8, type ArtProps } from "./base";

/** واجهة مجلس نجدي: باب خشبي، شرفات مثلثة، ونافذة مدببة */
export function Majlis(p: ArtProps) {
  const teeth = Array.from({ length: 8 }, (_, i) => `M${10 + i * 10} 22L${15 + i * 10} 12L${20 + i * 10} 22`).join("");
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M8 22H92V98H8Z" {...soft} />
      <path d="M8 22H92V98H8Z" />
      <path d={teeth} />
      <path d="M8 30H92" strokeOpacity={0.55} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${20 + i * 12} 36l3-4l3 4z`} fill="currentColor" stroke="none" fillOpacity={0.6} />)}
      {/* الباب */}
      <path d="M36 98V60C36 50 64 50 64 60V98" fill="currentColor" fillOpacity={0.2} />
      <path d="M36 98V60C36 50 64 50 64 60V98" />
      <path d="M50 53V98" />
      <path d="M40 64H46V72H40ZM54 64H60V72H54ZM40 78H46V86H40ZM54 78H60V86H54Z" strokeOpacity={0.6} strokeWidth={1} />
      <circle cx="47" cy="80" r="1.3" fill="currentColor" />
      <circle cx="53" cy="80" r="1.3" fill="currentColor" />
      {/* نوافذ */}
      <path d="M16 70V56Q21 48 26 56V70ZM74 70V56Q79 48 84 56V70Z" fill="currentColor" fillOpacity={0.15} />
      <path d="M16 70V56Q21 48 26 56V70ZM74 70V56Q79 48 84 56V70Z" />
    </Svg>
  );
}

export function Calendar(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <rect x="10" y="18" width="80" height="74" rx="6" {...soft} />
      <rect x="10" y="18" width="80" height="74" rx="6" />
      <path d="M10 36H90" />
      <path d="M30 10V26M70 10V26" strokeWidth={3} />
      {[0, 1, 2, 3].flatMap((c) => [0, 1, 2].map((r) => (
        <rect key={`${c}${r}`} x={20 + c * 17} y={46 + r * 14} width="9" height="8" rx="1.5"
          fill="currentColor" fillOpacity={c === 2 && r === 1 ? 0.9 : 0.25} stroke="none" />
      )))}
    </Svg>
  );
}

export function Pin(p: ArtProps) {
  return (
    <Svg vb="0 0 80 100" {...p}>
      <path d="M40 96S12 64 12 40A28 28 0 0 1 68 40C68 64 40 96 40 96Z" {...soft} />
      <path d="M40 96S12 64 12 40A28 28 0 0 1 68 40C68 64 40 96 40 96Z" />
      <path d={hexPath(40, 40, 11)} fill="currentColor" fillOpacity={0.5} />
      <path d={hexPath(40, 40, 11)} />
    </Svg>
  );
}

/** شاشة عرض على حامل */
export function Screen(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M50 4V10" strokeWidth={2.2} />
      <rect x="6" y="10" width="88" height="56" rx="3" {...soft} />
      <rect x="6" y="10" width="88" height="56" rx="3" />
      <path d="M16 54L32 40L46 46L62 28L82 36" strokeWidth={2} />
      <path d="M16 20H44M16 27H34" strokeOpacity={0.55} />
      <path d="M50 66V78M50 78L30 98M50 78L70 98M50 78V96" strokeWidth={2} />
    </Svg>
  );
}

/** ميكروفون على حامل */
export function Mic(p: ArtProps) {
  return (
    <Svg vb="0 0 80 100" {...p}>
      <rect x="26" y="4" width="28" height="46" rx="14" {...soft} />
      <rect x="26" y="4" width="28" height="46" rx="14" />
      <path d="M30 18H50M30 26H50M30 34H50" strokeOpacity={0.5} strokeWidth={1} />
      <path d="M16 36C16 52 26 62 40 62C54 62 64 52 64 36" />
      <path d="M40 62V88M24 94C24 88 56 88 56 94Z" strokeWidth={2} />
    </Svg>
  );
}

/** أوراق وقلم */
export function Papers(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M24 12H72L80 20V90H24Z" transform="rotate(-6 50 50)" fill="currentColor" fillOpacity={0.1} />
      <path d="M24 12H72L80 20V90H24Z" transform="rotate(-6 50 50)" strokeOpacity={0.6} />
      <path d="M18 14H66L74 22V92H18Z" {...soft} />
      <path d="M18 14H66L74 22V92H18Z" />
      <path d="M28 32H62M28 42H62M28 52H54M28 62H58" strokeOpacity={0.6} />
      <path d="M86 30L94 38L58 80L48 84L52 72Z" fill="currentColor" fillOpacity={0.35} />
      <path d="M86 30L94 38L58 80L48 84L52 72Z" />
    </Svg>
  );
}

/** بوصلة */
export function Compass(p: ArtProps) {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 24, r1 = i % 6 ? 40 : 36;
    return `M${(50 + r1 * Math.cos(a)).toFixed(1)} ${(50 + r1 * Math.sin(a)).toFixed(1)}L${(50 + 44 * Math.cos(a)).toFixed(1)} ${(50 + 44 * Math.sin(a)).toFixed(1)}`;
  }).join("");
  return (
    <Svg vb="0 0 100 100" {...p}>
      <circle cx="50" cy="50" r="46" {...soft} />
      <circle cx="50" cy="50" r="46" />
      <path d={ticks} strokeWidth={1.2} />
      <path d="M50 14L58 50L50 86L42 50Z" fill="currentColor" fillOpacity={0.2} />
      <path d="M50 14L58 50H42Z" fill="currentColor" />
      <path d="M50 14L58 50L50 86L42 50Z" />
      <path d="M14 50L50 44L86 50L50 56Z" fill="currentColor" fillOpacity={0.12} />
      <path d="M14 50L50 44L86 50L50 56Z" strokeOpacity={0.6} />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </Svg>
  );
}

export function Tent(p: ArtProps) {
  return (
    <Svg vb="0 0 100 80" {...p}>
      <path d="M50 8L94 74H6Z" {...soft} />
      <path d="M50 8L94 74H6Z" />
      <path d="M50 8L38 74M50 8L62 74" />
      <path d="M44 74L50 50L56 74" fill="currentColor" fillOpacity={0.4} />
      <path d="M50 8L46 2M50 8L56 2" />
    </Svg>
  );
}

/** جبال وطريق متعرج وشمس (شريط عريض) */
export function Mountains(p: ArtProps) {
  return (
    <Svg vb="0 0 400 110" {...p} sw={1.4}>
      <circle cx="300" cy="30" r="16" fill="currentColor" fillOpacity={0.3} />
      <circle cx="300" cy="30" r="16" />
      <path d="M0 110V78L60 34L96 62L150 14L214 70L256 44L322 88L360 60L400 84V110Z" {...soft} />
      <path d="M0 78L60 34L96 62L150 14L214 70L256 44L322 88L360 60L400 84" />
      <path d="M150 14L136 34L148 30L156 38L166 28Z" fill="currentColor" fillOpacity={0.4} stroke="none" />
      <path d="M60 34L50 44L60 42L68 46Z" fill="currentColor" fillOpacity={0.4} stroke="none" />
      <path d="M40 110C90 100 150 102 190 94C230 86 250 96 290 104" strokeDasharray="6 7" strokeWidth={2} />
    </Svg>
  );
}

/** كأس البطولة */
export function Trophy(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M26 8H74V30C74 48 64 58 50 58C36 58 26 48 26 30Z" {...soft} />
      <path d="M26 8H74V30C74 48 64 58 50 58C36 58 26 48 26 30Z" />
      <path d="M26 16H12C12 34 20 42 30 44M74 16H88C88 34 80 42 70 44" strokeWidth={2} />
      <path d="M44 58V72H56V58" />
      <path d="M34 72H66V82H34Z" fill="currentColor" fillOpacity={0.3} />
      <path d="M34 72H66V82H34Z" />
      <path d="M28 82H72V94H28Z" {...soft} />
      <path d="M28 82H72V94H28Z" />
      <path d={star8(50, 30, 9)} fill="currentColor" stroke="none" fillOpacity={0.85} />
    </Svg>
  );
}

/** منصة التتويج ١-٢-٣ */
export function Podium(p: ArtProps) {
  return (
    <Svg vb="0 0 100 80" {...p}>
      <path d="M36 20H64V78H36Z" fill="currentColor" fillOpacity={0.3} />
      <path d="M8 40H36V78H8ZM64 52H92V78H64Z" {...soft} />
      <path d="M36 20H64V78H36ZM8 40H36V78H8ZM64 52H92V78H64Z" />
      <path d="M50 30V42M46 34L50 30" strokeWidth={2.4} />
      <path d={sparkle(50, 8, 6)} fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function Megaphone(p: ArtProps) {
  return (
    <Svg vb="0 0 100 90" {...p}>
      <path d="M14 34H30L74 12V78L30 56H14Z" {...soft} />
      <path d="M14 34H30L74 12V78L30 56H14Z" />
      <path d="M30 34V56" />
      <path d="M22 56L28 80H38L34 58" />
      <path d="M84 30C90 38 90 52 84 60M90 22C100 34 100 56 90 68" strokeOpacity={0.7} />
    </Svg>
  );
}

export function Bell(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M50 10C32 10 24 26 24 44V62L14 76H86L76 62V44C76 26 68 10 50 10Z" {...soft} />
      <path d="M50 10C32 10 24 26 24 44V62L14 76H86L76 62V44C76 26 68 10 50 10Z" />
      <path d="M40 82C42 92 58 92 60 82" strokeWidth={2} />
      <path d="M50 4V10" strokeWidth={2.4} />
    </Svg>
  );
}

export function News(p: ArtProps) {
  return (
    <Svg vb="0 0 100 80" {...p}>
      <rect x="6" y="6" width="80" height="68" rx="4" {...soft} />
      <rect x="6" y="6" width="80" height="68" rx="4" />
      <path d="M86 20H94V66C94 70 90 74 86 74" />
      <path d="M16 18H76" strokeWidth={3} />
      <rect x="48" y="30" width="28" height="22" rx="2" fill="currentColor" fillOpacity={0.3} />
      <path d="M16 32H40M16 40H40M16 48H40M16 58H76M16 66H64" strokeOpacity={0.6} />
    </Svg>
  );
}

/** الرمز السداسي لأواصر */
export function Hex(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d={hexPath(50, 50, 44)} />
      <path d={hexPath(50, 50, 32)} strokeOpacity={0.6} />
      <path d={hexPath(50, 50, 20)} {...soft} />
      <path d={hexPath(50, 50, 20)} />
    </Svg>
  );
}

/** أعمدة بيانية صاعدة (للصندوق) */
export function Chart(p: ArtProps) {
  return (
    <Svg vb="0 0 100 90" {...p}>
      <path d="M8 84H94" />
      {[[14, 58], [34, 44], [54, 50], [74, 24]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="14" height={84 - y} rx="2" fill="currentColor" fillOpacity={0.14 + i * 0.08} />
          <rect x={x} y={y} width="14" height={84 - y} rx="2" />
        </g>
      ))}
      <path d="M21 46L41 32L61 38L81 12" strokeWidth={2} />
      <circle cx="81" cy="12" r="3" fill="currentColor" />
    </Svg>
  );
}
