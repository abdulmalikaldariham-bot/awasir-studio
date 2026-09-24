import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LibraryProvider } from "@/lib/library";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title: { default: "استوديو أواصر", template: "%s | استوديو أواصر" },
  description: "مولّد التصاميم الرسمي لأسرة آل دريهم",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#1C3F4E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-dvh bg-mist-50">
        <LibraryProvider>
          <Header />
          {children}
        </LibraryProvider>
      </body>
    </html>
  );
}
