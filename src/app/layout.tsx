import type { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

// 1. The critical mobile tag
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Stops iOS from zooming in when you tap an input
};

// 2. The single Metadata export
export const metadata: Metadata = {
  title: 'Zytrak Verified Marketplace',
  description: 'Procure medical supplies with fiat or USDC on Stellar.',
};

// 3. The single RootLayout export
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body 
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`} 
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}