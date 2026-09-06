import "./globals.css";
import { Cairo, Chakra_Petch } from "next/font/google";

import { getSettingFromCookie } from "@/lib/getSettingFromCookie";

import { AuthProvider } from "./providers/AuthProvider";

import type { Metadata } from "next";

const chakraPetch = Chakra_Petch({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${chakraPetch.variable} ${cairo.variable} antialiased h-full`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
