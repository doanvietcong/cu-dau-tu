import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/layout/Toaster";
import { RegisterSW } from "@/components/pwa/RegisterSW";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cu-dau-tu.pages.dev"),
  title: "Cú Đầu Tư — Học tài chính cá nhân mỗi ngày",
  description:
    "Học tài chính cá nhân theo phong cách Duolingo: gamification, streak, vui nhộn, hiệu quả. 100% cho người Việt.",
  keywords: ["tài chính cá nhân", "Duolingo", "học tài chính", "tiết kiệm", "đầu tư", "FIRE", "VND", "VNĐ", "ngân sách"],
  authors: [{ name: "Cú Đầu Tư" }],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.png" }],
  },
  openGraph: {
    title: "Cú Đầu Tư — Học tài chính cá nhân mỗi ngày",
    description: "Gamified personal finance learning for Vietnamese. 61 bài học qua 12 units (BĐS VN, crypto, tâm lý tài chính), streak, leaderboard, 100% miễn phí.",
    type: "website",
    locale: "vi_VN",
    siteName: "Cú Đầu Tư",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cú Đầu Tư — Học tài chính cá nhân",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cú Đầu Tư — Học tài chính cá nhân",
    description: "Gamified personal finance learning for Vietnamese. 100% miễn phí.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={nunito.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#58CC02" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cú Đầu Tư" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-duolingo-snow font-sans antialiased">
        {children}
        <RegisterSW />
        <Toaster />
      </body>
    </html>
  );
}
