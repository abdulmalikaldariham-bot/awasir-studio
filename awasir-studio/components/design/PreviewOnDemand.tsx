"use client";
import dynamic from "next/dynamic";

/**
 * محرك التصميم (المعاينة الحية وعناصر المناسبات) يُحمَّل عند الحاجة فقط:
 * صفحة القوالب تعرض صوراً مصغرة، ولا تنزّل كود الرسم إلا عند فتح قالب.
 */
export const PreviewOnDemand = dynamic(() => import("./Preview").then((m) => m.Preview), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full min-h-40 rounded-xl" />,
});
