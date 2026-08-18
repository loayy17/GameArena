import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import { getSettingFromCookie } from "@/lib/getLocaleFromCookie";
// this iss fordevelopement to test without login
const requireAuth = true;
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Arena 404",
    description: "Game platform",
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
      className={`${geistSans.variable} antialiased h-full`}>
      <body className="min-h-full">
        <AuthProvider requireAuth={requireAuth}>{children}</AuthProvider>
      </body>
    </html>
  );
}
