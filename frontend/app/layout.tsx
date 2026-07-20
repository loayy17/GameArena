import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./providers/AuthProvider";
import { getSettingFromCookie } from "@/lib/getLocaleFromCookie";

const themeLocaleScript = `(function(){try{var c=document.cookie.split('; ');var m={};for(var i=0;i<c.length;i++){var p=c[i].split('=');m[p[0]]=p[1];}var loc=m.locale==='ar'?'ar':'en';var th=m.theme==='light'?'light':'dark';var d=document.documentElement;d.lang=loc;d.dir=loc==='ar'?'rtl':'ltr';d.dataset.theme=th;}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameArena",
  description: "Game platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, theme } = await getSettingFromCookie();
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeLocaleScript }} />
      </head>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
