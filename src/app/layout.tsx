import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LearnFlow - Hệ thống quản lý học tập cá nhân",
  description: "Gom các tài nguyên học tập phân tán thành lộ trình học tập cá nhân",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="bg-[#F8F9FA] text-slate-800 font-sans leading-relaxed min-h-screen">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
