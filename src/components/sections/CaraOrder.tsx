import { orderSteps } from "@/lib/content";

export function CaraOrder() {
  return (
    <section id="cara-order" className="section-padding bg-background">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Cara Order
          </h2>
          <p className="text-text-muted">
            Proses sederhana dalam empat langkah.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {orderSteps.map((step) => (
            <div key={step.number} className="relative">
              <span className="mb-3 block text-3xl font-bold text-border">
                {step.number}
              </span>
              <h3 className="mb-2 text-base font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
