"use client";
import { forwardRef, memo, useMemo, type CSSProperties } from "react";
import type { Background, Brand, Custom, SizeId, Template, ThemeId } from "@/lib/types";
import { resolveContent } from "@/lib/format";
import { DEFAULT_CUSTOM, SIZES, STYLE_INFO, hexA, mix, palette, shapeOf, type Palette, type Shape } from "@/lib/design";
import { occasionOf, type ArtId, type Occasion } from "@/lib/occasions";
import { AutoFit, HexGrid, HexRings, Logo, Photo, Stack, type OrnKind } from "./parts";
import { Emblem, OccasionLayer, layerPlan } from "./Occasion";
import { Art } from "./art";

export interface DesignProps {
  template: Template;
  values: Record<string, string>;
  styleIndex: number;
  size: SizeId;
  custom?: Partial<Custom>;
  brand: Brand;
  backgrounds: Background[];
}

const ORN: Record<Occasion["title"], OrnKind> = {
  regal: "diamond", serene: "star", festive: "star", quiet: "none", soft: "dots",
  honor: "none", pro: "bar", warm: "triangles", bold: "bar", brand: "hex",
};

/** يرسم التصميم بمقاسه الحقيقي بالبكسل. المعاينة تصغّره بـ transform، والتصدير يلتقطه كما هو. */
export const Design = forwardRef<HTMLDivElement, DesignProps>(function Design(p, ref) {
  const custom: Custom = { ...DEFAULT_CUSTOM, ...p.custom, hidden: p.custom?.hidden ?? [] };
  const opt = p.template.styles[p.styleIndex] ?? p.template.styles[0];
  const style = opt?.style ?? "formal";
  const theme: ThemeId = custom.theme ?? opt?.theme ?? STYLE_INFO[style].defaultTheme;
  const spec = SIZES[p.size] ?? SIZES.post;
  const shape = shapeOf(spec.w, spec.h);
  const occ = occasionOf(p.template);
  const pal = useMemo(() => palette(theme, p.brand, custom.accent, occ), [theme, p.brand, custom.accent, occ]);
  const c = useMemo(() => {
    const r = resolveContent(p.template, p.values, p.brand);
    if (custom.order) r.order = custom.order;
    return r;
  }, [p.template, p.values, p.brand, custom.order]);
  const hidden = new Set(custom.hidden);
  const img = p.template.image !== "none" && custom.image?.src && !hidden.has("image") ? custom.image : undefined;
  const pattern = !custom.pattern || custom.pattern === "auto" ? occ.pattern : custom.pattern;
  const bgImage = p.backgrounds.find((b) => b.id === pattern);
  // الوحدة الأساسية: ١٪ من الضلع الأقصر، مع تكبير بسيط للمقاسات الطويلة لتملأ المساحة
  const u = (Math.min(spec.w, spec.h) / 100) * ({ tall: 1.2, portrait: 1.07, square: 1, wide: 1 } as const)[shape];
  const align = custom.align ?? (style === "minimal" || style === "photo" ? "start" : "center");
  const decor = !hidden.has("decor");
  const plan = layerPlan(occ, style, Boolean(img));
  const hero: ArtId = p.template.art ?? occ.hero;

  const rootStyle = {
    width: spec.w,
    height: spec.h,
    "--u": `${u}px`,
    "--bg": pal.bg, "--bg2": pal.bg2, "--fg": pal.fg, "--muted": pal.muted,
    "--accent": pal.accent, "--line": pal.line, "--card": pal.card, "--orn": pal.orn,
    "--navy": p.brand.colors.navy, "--teal": p.brand.colors.teal, "--light": p.brand.colors.light,
    "--tscale": custom.titleScale, "--bscale": custom.bodyScale,
  } as CSSProperties;

  const fitKey = JSON.stringify([c, custom.hidden, custom.titleScale, custom.bodyScale, custom.align, custom.logo, custom.order, p.size, style, Boolean(img), decor]);
  const layer = decor ? (
    <OccasionLayer occ={occ} style={style} shape={shape} hero={hero} w={spec.w} h={spec.h} u={u} hasImage={Boolean(img)} />
  ) : null;
  const ctx: Ctx = {
    c, pal, theme, shape, hidden, custom, img, bgImage, pattern, brand: p.brand, align, fitKey, u, layer,
    orn: ORN[occ.title], emblem: decor && plan.emblem ? occ.emblem : undefined, hero: decor ? hero : undefined,
  };

  const body = {
    formal: <Formal {...ctx} />,
    minimal: <Minimal {...ctx} />,
    premium: <Premium {...ctx} />,
    split: <Split {...ctx} />,
    photo: <PhotoStyle {...ctx} />,
    family: <Family {...ctx} />,
  }[style];

  return (
    <div ref={ref} className="aw" dir="rtl" data-style={style} data-shape={shape} data-theme={theme} data-align={align}
      data-occ={occ.id} data-title={occ.title}
      data-hang={decor && plan.hang !== "none" ? plan.hang : undefined}
      data-ground={decor && plan.ground !== "none" ? plan.ground : undefined}
      data-corner={decor && plan.hero === "corner" ? "" : undefined}
      data-herotop={decor && plan.hero === "hero" ? "" : undefined}
      style={rootStyle}>
      {body}
    </div>
  );
});

interface Ctx {
  c: ReturnType<typeof resolveContent>;
  pal: Palette; theme: ThemeId; shape: Shape; hidden: Set<string>; custom: Custom;
  img?: Custom["image"]; bgImage?: Background; pattern: string; brand: Brand; align: "center" | "start"; fitKey: string; u: number;
  layer: React.ReactNode; orn: OrnKind; emblem?: ArtId; hero?: ArtId;
}

/** النمط السداسي. معزول بـ memo لأنه لا يتغير مع الكتابة */
const Pattern = memo(function Pattern({ pattern, line, u, bgSrc, bg, ringsAt }: {
  pattern: string; line: string; u: number; bgSrc?: string; bg: string; ringsAt: "corner" | "center" | "none";
}) {
  if (bgSrc) {
    return (
      <>
        <div className="aw-fill aw-bgimg" style={{ backgroundImage: `url(${bgSrc})` }} />
        <div className="aw-fill" style={{ background: hexA(bg, 0.8) }} />
      </>
    );
  }
  if (pattern === "grid") return <HexGrid stroke={line} cell={u * 3.2} opacity={0.55} />;
  if (pattern !== "rings" || ringsAt === "none") return null;
  if (ringsAt === "center") return <HexRings className="aw-rings-center" stroke={line} count={9} />;
  return (
    <>
      <HexRings className="aw-rings-a" stroke={line} count={8} />
      <HexRings className="aw-rings-b" stroke={line} count={5} />
    </>
  );
});

function Background({ ctx, ringsAt = "corner" }: { ctx: Ctx; ringsAt?: "corner" | "center" | "none" }) {
  if (ctx.hidden.has("pattern")) return null;
  return <Pattern pattern={ctx.pattern} line={ctx.pal.line} u={ctx.u} bgSrc={ctx.bgImage?.src} bg={ctx.pal.bg} ringsAt={ringsAt} />;
}

const topImage = (ctx: Ctx) =>
  ctx.img ? <Photo img={ctx.img} className="aw-hexphoto" /> : ctx.emblem ? <Emblem id={ctx.emblem} /> : undefined;

function Content({ ctx, ornament, withImage = true, className }: { ctx: Ctx; ornament?: boolean; withImage?: boolean; className?: string }) {
  return (
    <AutoFit deps={ctx.fitKey} className={className}>
      <Stack c={ctx.c} hidden={ctx.hidden} ornament={ornament ? ctx.orn : undefined} dark={ctx.pal.dark}
        image={withImage ? topImage(ctx) : undefined} />
    </AutoFit>
  );
}

function Formal(ctx: Ctx) {
  return (
    <div className="aw-fill aw-formal" style={{ background: ctx.pal.bg }}>
      <Background ctx={ctx} />
      {ctx.layer ?? <div className="aw-frame" />}
      <div className="aw-col">
        <Logo brand={ctx.brand} kind={ctx.custom.logo} theme={ctx.theme} layout="vertical" className="aw-logo-v" />
        <Content ctx={ctx} ornament />
      </div>
    </div>
  );
}

function Minimal(ctx: Ctx) {
  return (
    <div className="aw-fill aw-minimal" style={{ background: ctx.pal.bg }}>
      <Background ctx={ctx} ringsAt={ctx.hero ? "none" : "corner"} />
      {ctx.layer}
      <div className="aw-col">
        <div className="aw-top">
          <Logo brand={ctx.brand} kind={ctx.custom.logo} theme={ctx.theme} layout="horizontal" className="aw-logo-h" />
        </div>
        <Content ctx={ctx} ornament={ctx.orn !== "hex" && ctx.orn !== "none"} />
      </div>
    </div>
  );
}

function Premium(ctx: Ctx) {
  const bg = `linear-gradient(155deg, ${ctx.pal.bg} 0%, ${mix(ctx.pal.bg, ctx.pal.bg2, 0.55)} 100%)`;
  return (
    <div className="aw-fill aw-premium" style={{ background: ctx.pal.dark ? bg : ctx.pal.bg }}>
      <Background ctx={ctx} ringsAt="center" />
      {ctx.layer}
      <div className="aw-col">
        <Logo brand={ctx.brand} kind={ctx.custom.logo === "full" ? "mark" : ctx.custom.logo} theme={ctx.theme} layout="vertical" className="aw-logo-mark" />
        <Content ctx={ctx} ornament />
        {ctx.custom.logo === "full" && (
          <Logo brand={ctx.brand} kind="full" theme={ctx.theme} layout="horizontal" className="aw-logo-foot" />
        )}
      </div>
    </div>
  );
}

function Split(ctx: Ctx) {
  const textPal = ctx.theme === "light" ? ctx.pal : palette("light", ctx.brand, ctx.custom.accent === "white" ? undefined : ctx.custom.accent);
  const textVars = {
    "--fg": textPal.fg, "--muted": textPal.muted, "--accent": textPal.accent, "--line": textPal.line, "--orn": ctx.theme === "light" ? ctx.pal.orn : mixOrn(ctx),
  } as CSSProperties;
  const panelTheme: ThemeId = ctx.theme === "light" ? "navy" : ctx.theme;
  const panelPal = palette(panelTheme, ctx.brand);
  const panelBg = ctx.theme === "light" ? ctx.brand.colors.navy : ctx.pal.bg;
  const pctx: Ctx = { ...ctx, pal: { ...panelPal, bg: panelBg, line: hexA(ctx.brand.colors.light, 0.5) }, theme: panelTheme };
  return (
    <div className="aw-fill aw-split">
      <div className="aw-panel" style={{ background: panelBg, "--orn": ctx.theme === "light" ? palette("navy", ctx.brand).orn : ctx.pal.orn } as CSSProperties}>
        {ctx.img ? <Photo img={ctx.img} className="aw-fill" /> : <Background ctx={pctx} ringsAt={ctx.hero ? "none" : "center"} />}
        {!ctx.img && ctx.hero && (
          <>
            <HexRings className="aw-panel-rings" stroke={hexA(ctx.brand.colors.light, 0.35)} count={6} />
            <Art id={ctx.hero} className="aw-panel-art" />
          </>
        )}
        {ctx.img && <div className="aw-fill aw-panel-shade" />}
        <Logo brand={ctx.brand} kind={ctx.custom.logo} theme={panelTheme} layout="horizontal" className="aw-logo-h aw-panel-logo" />
      </div>
      <div className="aw-text" style={{ ...textVars, background: "#FFFFFF" }}>
        <Content ctx={{ ...ctx, pal: textPal }} withImage={false} ornament={ctx.orn !== "hex" && ctx.orn !== "none"} />
      </div>
    </div>
  );
}

// لون زخرفة المناسبة على الخلفية البيضاء في الشكل الحديث
function mixOrn(ctx: Ctx) {
  return ctx.pal.dark ? mix(ctx.pal.orn, "#1C3F4E", 0.3) : ctx.pal.orn;
}

function PhotoStyle(ctx: Ctx) {
  const shade = `linear-gradient(to top, ${ctx.pal.bg} 0%, ${hexA(ctx.pal.bg, 0.9)} 38%, ${hexA(ctx.pal.bg, 0.25)} 72%, ${hexA(ctx.pal.bg, 0.1)} 100%)`;
  return (
    <div className="aw-fill aw-photo-style" style={{ background: `linear-gradient(160deg, ${ctx.pal.bg}, ${ctx.pal.bg2})` }}>
      {ctx.img ? <Photo img={ctx.img} className="aw-fill" /> : <HexRings className="aw-rings-hero" stroke={ctx.pal.line} count={ctx.hero ? 6 : 10} />}
      <div className="aw-fill" style={{ background: ctx.img ? shade : "transparent" }} />
      {ctx.layer}
      <div className="aw-col">
        <div className="aw-top">
          <Logo brand={ctx.brand} kind={ctx.custom.logo} theme={ctx.theme === "light" ? "navy" : ctx.theme} layout="horizontal" className="aw-logo-h" />
        </div>
        <Content ctx={ctx} withImage={false} />
      </div>
    </div>
  );
}

function Family(ctx: Ctx) {
  const showGrid = !ctx.hidden.has("pattern") && ctx.pattern !== "none" && !ctx.bgImage;
  return (
    <div className="aw-fill aw-family" style={{ background: ctx.pal.dark ? ctx.pal.bg : mix(ctx.pal.bg, ctx.brand.colors.light, 0.35) }}>
      {showGrid && <HexGrid stroke={ctx.pal.dark ? ctx.pal.line : hexA(ctx.brand.colors.teal, 0.22)} cell={ctx.u * 3.2} />}
      {ctx.bgImage && <Background ctx={ctx} />}
      {ctx.layer}
      <div className="aw-card" style={{ background: ctx.pal.dark ? hexA("#FFFFFF", 0.06) : "#FFFFFF" }}>
        {ctx.custom.logo !== "none" && (
          <div className="aw-badge">
            <Logo brand={ctx.brand} kind="mark" theme="teal" layout="vertical" className="aw-badge-mark" />
          </div>
        )}
        <Content ctx={ctx} ornament />
        {ctx.custom.logo === "full" && (
          <Logo brand={ctx.brand} kind="full" theme={ctx.theme} layout="horizontal" className="aw-logo-foot" />
        )}
      </div>
    </div>
  );
}
