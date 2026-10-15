import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "missing-project-id";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/**
 * Konfigurasi Sanity Studio (panel admin).
 * Studio ini di-mount di /studio oleh src/app/studio/[[...tool]]/page.tsx.
 *
 * Nilai projectId/dataset dibaca dari environment supaya repo tidak berisi
 * kredensial apa pun. Lihat README bagian "Panel Admin (Sanity)".
 */
export default defineConfig({
  name: "toko-grosir-makmur",
  title: "Toko Grosir Makmur",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
