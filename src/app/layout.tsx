import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Chá de Casa Nova",
  description: "Venha celebrar o nosso novo lar conosco.",
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
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ScrollToTop />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
