import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/layout/Toaster";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cú Đầu Tư — Học tài chính cá nhân mỗi ngày",
  description:
    "Học tài chính cá nhân theo phong cách Duolingo: gamification, streak, vui nhộn, hiệu quả. Dành cho người Việt.",
  keywords: ["tài chính cá nhân", "Duolingo", "học tài chính", "tiết kiệm", "đầu tư", "FIRE"],
  openGraph: {
    title: "Cú Đầu Tư — Học tài chính cá nhân mỗi ngày",
    description: "Gamified personal finance learning for Vietnamese",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#58CC02",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={nunito.variable}>
      <body className="min-h-screen bg-duolingo-snow font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
