import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { navItems, siteConfig, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page section-padding">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{siteConfig.name}</h3>
            <p className="text-sm leading-relaxed text-text-muted">
              Grosir sembako dan kebutuhan rumah tangga terpercaya sejak{" "}
              {siteConfig.since}. Melayani warung, toko kelontong, dan reseller.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-primary hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Kontak
            </h4>
            <ul className="space-y-3 text-sm text-text-primary">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {siteConfig.address}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-text-muted" />
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {siteConfig.phoneDisplay} (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Jam Operasional
            </h4>
            <ul className="space-y-2 text-sm text-text-primary">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-text-muted" />
                <span>{siteConfig.hours.open}</span>
              </li>
              <li className="pl-6 text-text-muted">{siteConfig.hours.closed}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
