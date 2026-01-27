import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import serif font
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "New Home Celebration",
  description: "Join us in celebrating our new home.",
  icons: {
    icon: '/logo.svg',
  },
};

import { Toaster } from 'sonner';
import { ScrollToTop } from '@/components/ScrollToTop';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} bg-slate-50 text-slate-700 antialiased`}>
        <ScrollToTop />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
