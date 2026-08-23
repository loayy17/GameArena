import "./globals.css";
import type { Metadata } from "next";
import { Cairo, Geist } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import { getSettingFromCookie } from "@/lib/getLocaleFromCookie";

const requireAuth = true;
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "GameArena - Gaming Platform",
    description: "Compete, connect, and play. Your ultimate gaming arena.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, theme } = await getSettingFromCookie();
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme={theme}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${cairo.variable} antialiased h-full`}>
      <body className="min-h-full">
        <AuthProvider requireAuth={requireAuth}>{children}</AuthProvider>
      </body>
    </html>
  );
}
