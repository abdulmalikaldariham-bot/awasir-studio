// المواليد، التخرج والنجاح، الترقيات والوظائف
import { Svg, soft, sparkle, scallop, star8, type ArtProps } from "./base";

/** هلال وغيوم ناعمة ونجوم */
export function MoonClouds(p: ArtProps) {
  const cloud = "M14 78C6 78 4 68 11 65C11 57 21 54 26 60C29 52 42 52 44 61C52 60 55 69 50 74C49 77 46 78 43 78Z";
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M60 12A30 30 0 1 0 86 58A24 24 0 1 1 60 12Z" {...soft} />
      <path d="M60 12A30 30 0 1 0 86 58A24 24 0 1 1 60 12Z" />
      <path d={cloud} fill="currentColor" fillOpacity={0.22} />
      <path d={cloud} />
      <path d={cloud} transform="translate(46 12) scale(0.8)" fill="currentColor" fillOpacity={0.14} />
      <path d={cloud} transform="translate(46 12) scale(0.8)" />
      <path d={sparkle(18, 22, 6)} fill="currentColor" stroke="none" />
      <path d={sparkle(88, 18, 4)} fill="currentColor" stroke="none" fillOpacity={0.8} />
      <path d={sparkle(30, 40, 3)} fill="currentColor" stroke="none" fillOpacity={0.6} />
    </Svg>
  );
}

/** هلال صغير تتدلى منه نجمتان */
export function CradleStars(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M40 10A38 38 0 1 0 90 66A30 30 0 1 1 40 10Z" {...soft} />
      <path d="M40 10A38 38 0 1 0 90 66A30 30 0 1 1 40 10Z" strokeWidth={2} />
      <path d="M64 30V50M78 34V62" strokeWidth={1} />
      <path d={sparkle(64, 56, 7)} fill="currentColor" stroke="none" />
      <path d={sparkle(78, 68, 6)} fill="currentColor" stroke="none" fillOpacity={0.8} />
    </Svg>
  );
}

/** قبعة التخرج */
export function Cap(p: ArtProps) {
  return (
    <Svg vb="0 0 100 90" {...p}>
      <path d="M26 44V64C26 72 74 72 74 64V44" {...soft} />
      <path d="M26 44V64C26 72 74 72 74 64V44" />
      <path d="M4 36L50 16L96 36L50 56Z" fill="currentColor" fillOpacity={0.3} />
      <path d="M4 36L50 16L96 36L50 56Z" />
      <path d="M50 36L84 44V68" />
      <path d="M80 68H88L90 80H78Z" fill="currentColor" fillOpacity={0.5} />
      <path d="M80 68H88L90 80H78Z" />
      <circle cx="50" cy="36" r="2.4" fill="currentColor" />
      <path d={sparkle(14, 12, 6)} fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** شهادة ملفوفة بشريط */
export function Diploma(p: ArtProps) {
  return (
    <Svg vb="0 0 100 70" {...p}>
      <path d="M12 20H82C90 20 90 50 82 50H12Z" {...soft} />
      <path d="M12 20H82C90 20 90 50 82 50H12" />
      <ellipse cx="12" cy="35" rx="6" ry="15" {...soft} />
      <ellipse cx="12" cy="35" rx="6" ry="15" />
      <ellipse cx="12" cy="35" rx="2" ry="5" />
      <path d="M50 20V50" strokeWidth={4} strokeOpacity={0.7} />
      <path d="M50 50L44 66L50 62L56 66Z" fill="currentColor" fillOpacity={0.5} />
      <path d="M50 50L44 66L50 62L56 66Z" />
    </Svg>
  );
}

/** وسام بشريطين */
export function Medal(p: ArtProps) {
  return (
    <Svg vb="0 0 80 100" {...p}>
      <path d="M22 4H36L46 40H32Z" fill="currentColor" fillOpacity={0.25} />
      <path d="M22 4H36L46 40H32Z" />
      <path d="M58 4H44L34 40H48Z" fill="currentColor" fillOpacity={0.35} />
      <path d="M58 4H44L34 40H48Z" />
      <circle cx="40" cy="64" r="26" {...soft} />
      <circle cx="40" cy="64" r="26" />
      <circle cx="40" cy="64" r="19" strokeOpacity={0.55} />
      <path d={star8(40, 64, 10)} fill="currentColor" stroke="none" fillOpacity={0.8} />
    </Svg>
  );
}

/** وردة التكريم (شارة) */
export function Rosette(p: ArtProps) {
  return (
    <Svg vb="0 0 100 110" {...p}>
      <path d="M36 66L24 104L36 96L44 106L50 70Z" fill="currentColor" fillOpacity={0.25} />
      <path d="M36 66L24 104L36 96L44 106L50 70Z" />
      <path d="M64 66L76 104L64 96L56 106L50 70Z" fill="currentColor" fillOpacity={0.35} />
      <path d="M64 66L76 104L64 96L56 106L50 70Z" />
      <path d={scallop(50, 44, 38, 22, 4)} {...soft} />
      <path d={scallop(50, 44, 38, 22, 4)} />
      <circle cx="50" cy="44" r="26" />
      <circle cx="50" cy="44" r="22" strokeOpacity={0.5} strokeWidth={1} />
      <path d={sparkle(50, 44, 12)} fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** حقيبة عمل */
export function Briefcase(p: ArtProps) {
  return (
    <Svg vb="0 0 100 86" {...p}>
      <path d="M38 22V14C38 11 40 10 42 10H58C60 10 62 11 62 14V22" strokeWidth={2.2} />
      <rect x="8" y="22" width="84" height="58" rx="6" {...soft} />
      <rect x="8" y="22" width="84" height="58" rx="6" />
      <path d="M8 46C30 54 70 54 92 46" />
      <rect x="44" y="44" width="12" height="12" rx="2" fill="currentColor" fillOpacity={0.5} />
      <rect x="44" y="44" width="12" height="12" rx="2" />
    </Svg>
  );
}

/** درجات صاعدة مع سهم */
export function Steps(p: ArtProps) {
  return (
    <Svg vb="0 0 100 90" {...p}>
      {[[8, 66, 18], [30, 52, 32], [52, 38, 46], [74, 22, 62]].map(([x, y, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width="18" height={h + 2} rx="2" fill="currentColor" fillOpacity={0.12 + i * 0.07} />
          <rect x={x} y={y} width="18" height={h + 2} rx="2" />
        </g>
      ))}
      <path d="M10 50L36 32L56 24L86 6" strokeWidth={2.2} />
      <path d="M76 5H87V16" strokeWidth={2.2} />
    </Svg>
  );
}

/** شهادة بختم */
export function Certificate(p: ArtProps) {
  return (
    <Svg vb="0 0 100 80" {...p}>
      <rect x="6" y="6" width="88" height="62" rx="3" {...soft} />
      <rect x="6" y="6" width="88" height="62" rx="3" />
      <rect x="12" y="12" width="76" height="50" rx="2" strokeOpacity={0.5} strokeWidth={1} />
      <path d="M26 24H74M22 34H62M22 42H56" strokeOpacity={0.7} />
      <path d={scallop(74, 54, 12, 12, 2)} fill="currentColor" fillOpacity={0.45} />
      <path d={scallop(74, 54, 12, 12, 2)} />
      <path d="M68 64L64 78L70 74L74 78M80 64L84 78L78 74" />
    </Svg>
  );
}
