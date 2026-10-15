import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Panel admin tidak untuk diindeks mesin pencari.
      disallow: ["/studio"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
