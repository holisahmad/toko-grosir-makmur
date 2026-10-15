import { createClient } from "next-sanity";
import type { SanityClient } from "@sanity/client";

/**
 * Klien Sanity untuk membaca konten.
 * projectId/dataset TIDAK di-hardcode — dibaca dari environment.
 *
 * Jika NEXT_PUBLIC_SANITY_PROJECT_ID kosong, `client` bernilai null dan situs
 * otomatis memakai konten statis dari `src/lib/content.ts` (lihat queries.ts).
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

export const sanityEnabled = Boolean(projectId);

export const client: SanityClient | null = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;
