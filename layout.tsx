import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Сонвейс",
  description: "Посты и сценарии для твоего бизнеса в один клик",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans">
        <span className="fixed right-4 top-4 z-50 rounded-full bg-blue/10 px-3 py-1 text-sm font-semibold text-blue">
          Бета
        </span>
        {children}
      </body>
    </html>
  );
}
