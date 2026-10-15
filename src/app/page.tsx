import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Keunggulan } from "@/components/sections/Keunggulan";
import { KategoriProduk } from "@/components/sections/KategoriProduk";
import { HargaGrosir } from "@/components/sections/HargaGrosir";
import { CaraOrder } from "@/components/sections/CaraOrder";
import { Testimoni } from "@/components/sections/Testimoni";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

/** ISR: konten Sanity diambil ulang tiap 60 detik tanpa perlu deploy ulang. */
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Keunggulan />
        <KategoriProduk />
        <HargaGrosir />
        <CaraOrder />
        <Testimoni />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
