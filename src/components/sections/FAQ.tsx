"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { faqs } from "@/lib/content";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-page">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight">
            Pertanyaan Umum
          </h2>
          <p className="text-text-muted">
            Jawaban untuk pertanyaan yang paling sering diajukan.
          </p>
        </div>

        <div className="mx-auto max-w-2xl divide-y divide-border rounded-card border border-border bg-surface">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-medium text-text-primary transition-colors hover:bg-background"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                  >
                    {faq.q}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-text-muted transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>
                {/* grid-rows trick: tinggi menyesuaikan isi, tidak ada max-h yang memotong teks */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  inert={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-4 text-sm leading-relaxed text-text-muted">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
