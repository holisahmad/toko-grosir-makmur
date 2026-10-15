import { testimonials } from "@/lib/content";

export function Testimoni() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Kata Pelanggan
          </h2>
          <p className="text-text-muted">
            Testimoni dari warung dan reseller yang sudah bergabung.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-card border border-border bg-background p-6"
            >
              <p className="mb-6 text-sm leading-relaxed text-text-primary">
                “{t.quote}”
              </p>
              <footer>
                <p className="font-semibold text-text-primary">{t.name}</p>
                <p className="text-sm text-text-muted">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
