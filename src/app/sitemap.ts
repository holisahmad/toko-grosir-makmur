import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllProductSlugs } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  // Kalau Sanity belum dikonfigurasi atau sedang tidak bisa dihubungi,
  // sitemap tetap berisi halaman statis (tidak boleh gagal total).
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllProductSlugs();
    productPages = slugs.map((slug) => ({
      url: `${siteConfig.url}/produk/${slug}`,
      lastModified,
    }));
  } catch {
    productPages = [];
  }

  return [
    { url: siteConfig.url, lastModified },
    { url: `${siteConfig.url}/produk`, lastModified },
    ...productPages,
  ];
}
