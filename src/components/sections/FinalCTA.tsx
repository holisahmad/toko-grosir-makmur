import { MessageCircle } from "lucide-react";
import { waLink, WA_ORDER_MESSAGE } from "@/lib/site";

export function FinalCTA() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-page">
        <div className="mx-auto max-w-2xl rounded-card border border-border bg-background px-6 py-12 text-center sm:px-12">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Siap Mulai Order Grosir?
          </h2>
          <p className="mb-8 text-text-muted">
            Hubungi kami sekarang untuk cek stok, tanya harga, atau langsung order.
            Tim kami siap membantu.
          </p>
          <a
            href={waLink(WA_ORDER_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <MessageCircle className="h-4 w-4" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
