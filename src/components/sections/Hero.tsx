import Image from "next/image";
import { MessageCircle, ArrowRight } from "lucide-react";
import {
  siteConfig,
  waLink,
  WA_ORDER_MESSAGE,
  activeCustomers,
  yearsInBusiness,
} from "@/lib/site";

export function Hero() {
  return (
    <section className="section-padding bg-background">
      <div className="container-page">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Teks dulu di mobile agar headline + CTA terlihat tanpa scroll */}
          <div className="text-center lg:text-left">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-text-muted">
              Grosir Terpercaya sejak {siteConfig.since}
            </p>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:leading-[1.1]">
              Harga Grosir Jujur, Stok Selalu Tersedia
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-text-muted lg:mx-0">
              Melayani warung, toko kelontong, dan reseller dengan harga
              kompetitif, stok real-time, dan pengiriman cepat.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href={waLink(WA_ORDER_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Chat WhatsApp Sekarang
              </a>
              <a href="#harga" className="btn-secondary w-full sm:w-auto">
                Lihat Harga Grosir
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border pt-8 text-sm text-text-muted lg:justify-start">
              <span>
                <strong className="font-semibold text-text-primary">
                  {yearsInBusiness}+
                </strong>{" "}
                tahun
              </span>
              <span aria-hidden="true" className="hidden text-border sm:inline">
                |
              </span>
              <span>
                <strong className="font-semibold text-text-primary">
                  {activeCustomers}
                </strong>{" "}
                pelanggan aktif
              </span>
              <span aria-hidden="true" className="hidden text-border sm:inline">
                |
              </span>
              <span>
                Area:{" "}
                <strong className="font-semibold text-text-primary">
                  {siteConfig.area}
                </strong>
              </span>
            </div>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-card border border-border bg-surface shadow-soft">
              <Image
                src="/images/hero-placeholder.svg"
                alt={`Produk grosir ${siteConfig.name}`}
                width={800}
                height={520}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
