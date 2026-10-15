import { defineCliConfig } from "sanity/cli";

/**
 * Konfigurasi Sanity CLI — dipakai perintah terminal seperti:
 *
 *   npx sanity dataset import sanity/seed.ndjson production
 *   npx sanity cors list
 *   npx sanity documents query '*[_type == "product"]'
 *
 * TIDAK ada kredensial di file ini: projectId dibaca dari environment
 * (`.env.local` saat lokal, atau Environment Variables di Vercel).
 * Pola nilainya publik — sama seperti yang dipakai browser Studio.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing-project-id",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  },
});
