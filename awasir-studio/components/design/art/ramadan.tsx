// عناصر رمضان: الفانوس، الهلال، المحراب، الرحل
import { Svg, soft, sparkle, type ArtProps } from "./base";

/** فانوس رمضاني (بدون الحبل، يُرسم الحبل منفصلاً بطول متغير) */
export function Lantern(p: ArtProps) {
  return (
    <Svg vb="0 0 40 84" {...p} sw={1.3}>
      <circle cx="20" cy="4" r="2.6" />
      <path d="M20 6.6V10" />
      <path d="M11 22C12 15 16 11 20 10C24 11 28 15 29 22Z" {...soft} />
      <path d="M11 22C12 15 16 11 20 10C24 11 28 15 29 22Z" />
      <path d="M8.5 22H31.5V26H8.5Z" {...soft} />
      <path d="M8.5 22H31.5V26H8.5Z" />
      <path d="M10 26H30L28 56H12Z" fill="currentColor" fillOpacity={0.22} />
      <path d="M10 26H30L28 56H12Z" />
      <path d="M16 26.5L15.4 55.5M20 26.5V55.5M24 26.5L24.6 55.5" strokeOpacity={0.6} strokeWidth={0.9} />
      <path d="M13.5 34Q20 29 26.5 34M13 44Q20 39 27 44" strokeOpacity={0.55} strokeWidth={0.9} />
      <path d="M10 56H30V60H10Z" {...soft} />
      <path d="M10 56H30V60H10Z" />
      <path d="M12 60L20 72L28 60" {...soft} />
      <path d="M12 60L20 72L28 60" />
      <path d="M20 72V78M20 80.5a1.6 1.6 0 1 0 0.01 0" />
    </Svg>
  );
}

/** هلال مع نجمة */
export function Crescent(p: ArtProps) {
  return (
    <Svg vb="0 0 100 100" {...p}>
      <path d="M58 8A44 44 0 1 0 90 72A36 36 0 1 1 58 8Z" {...soft} />
      <path d="M58 8A44 44 0 1 0 90 72A36 36 0 1 1 58 8Z" strokeWidth={1.8} />
      <path d="M52 16A36 36 0 1 0 80 70" strokeOpacity={0.35} strokeWidth={1} />
      <path d={sparkle(80, 30, 9)} fill="currentColor" stroke="none" />
      <path d={sparkle(92, 48, 4)} fill="currentColor" stroke="none" fillOpacity={0.7} />
    </Svg>
  );
}

/** محراب بقوس مدبب ومصباح معلق */
export function Mihrab(p: ArtProps) {
  return (
    <Svg vb="0 0 80 110" {...p}>
      <path d="M6 108V46C6 22 26 8 40 2C54 8 74 22 74 46V108" {...soft} />
      <path d="M6 108V46C6 22 26 8 40 2C54 8 74 22 74 46V108" />
      <path d="M14 108V48C14 30 29 18 40 12C51 18 66 30 66 48V108" strokeOpacity={0.55} />
      <path d="M40 12V36" strokeOpacity={0.6} strokeWidth={1} />
      <path d="M33 36H47L45 46C44 49 36 49 35 46Z" fill="currentColor" fillOpacity={0.3} />
      <path d="M33 36H47L45 46C44 49 36 49 35 46Z" />
      <path d="M2 108H78" />
    </Svg>
  );
}

/** رحل خشبي عليه مصحف مفتوح */
export function QuranStand(p: ArtProps) {
  return (
    <Svg vb="0 0 100 90" {...p}>
      <path d="M50 42L22 86M50 42L78 86M34 66H66" strokeWidth={2.2} />
      <path d="M50 44C40 36 24 34 10 38L16 58C28 54 42 56 50 62C58 56 72 54 84 58L90 38C76 34 60 36 50 44Z" {...soft} />
      <path d="M50 44C40 36 24 34 10 38L16 58C28 54 42 56 50 62C58 56 72 54 84 58L90 38C76 34 60 36 50 44Z" />
      <path d="M50 44V62" />
      <path d="M20 44C30 42 40 44 46 48M22 50C31 48 40 50 46 53M80 44C70 42 60 44 54 48M78 50C69 48 60 50 54 53" strokeOpacity={0.5} strokeWidth={1} />
      <path d={sparkle(50, 16, 8)} fill="currentColor" stroke="none" />
    </Svg>
  );
}
