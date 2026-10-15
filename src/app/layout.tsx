import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartWidget } from "@/components/cart/CartWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${siteConfig.name} | Grosir Sembako & Kebutuhan Rumah Tangga`;
const description = `Toko grosir terpercaya sejak ${siteConfig.since}. Harga kompetitif, stok real, pengiriman cepat untuk warung dan reseller.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "id_ID",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans`}>
        {/* Daftar pesanan pembeli tersedia di semua halaman (kecuali /studio). */}
        <CartProvider>
          {children}
          <CartWidget />
        </CartProvider>
      </body>
    </html>
  );
}
