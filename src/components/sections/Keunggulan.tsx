import { features } from "@/lib/content";

export function Keunggulan() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Mengapa Pilih Kami
          </h2>
          <p className="text-text-muted">
            Empat alasan utama pelanggan setia memilih Toko Grosir Makmur.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-card border border-border bg-background p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-button border border-border bg-surface text-text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
