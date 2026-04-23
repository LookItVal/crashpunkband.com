import type { Metadata } from "next";
import { Partytown } from "@builder.io/partytown/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRASH",
  description: "CRASH - Coming Soon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Partytown forward={["dataLayer.push"]} />
        {/* Preload LCP image so the browser discovers and prioritises it from the initial HTML */}
        <link
          rel="preload"
          as="image"
          href="/crash_banner.webp"
          imageSrcSet="/responsive/crash_banner-320w.webp 320w, /responsive/crash_banner-480w.webp 480w, /responsive/crash_banner-640w.webp 640w, /responsive/crash_banner-768w.webp 768w, /responsive/crash_banner-960w.webp 960w, /responsive/crash_banner-1200w.webp 1200w"
          imageSizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 80vw, 768px"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
