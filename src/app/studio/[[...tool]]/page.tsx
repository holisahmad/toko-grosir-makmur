import { StudioShell } from "./StudioShell";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

const MISSING_ENV = !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export default function StudioPage() {
  if (MISSING_ENV) {
    return (
      <main className="container-page section-padding">
        <div className="mx-auto max-w-2xl rounded-card border border-border bg-surface p-8">
          <h1 className="mb-3 text-2xl font-semibold">
            Panel admin belum dikonfigurasi
          </h1>
          <p className="mb-4 text-sm leading-relaxed text-text-muted">
            Buat proyek Sanity, lalu isi environment variable berikut di{" "}
            <code className="rounded bg-background px-1">.env.local</code> (lokal)
            dan di Vercel → Settings → Environment Variables.
          </p>
          <pre className="overflow-x-auto rounded-button border border-border bg-background p-4 text-xs">
            {`NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production`}
          </pre>
          <p className="mt-4 text-sm text-text-muted">
            Detail langkahnya ada di README, bagian “Panel Admin (Sanity)”.
          </p>
        </div>
      </main>
    );
  }

  return <StudioShell />;
}
