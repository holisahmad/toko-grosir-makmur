import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { client } from "./client";

const builder = client ? createImageUrlBuilder(client) : null;

/**
 * Ubah referensi gambar Sanity menjadi URL CDN.
 * Mengembalikan null jika Sanity tidak aktif atau referensi tidak valid.
 */
export function urlForImage(
  source: SanityImageSource | null | undefined,
  size = 640
): string | null {
  if (!builder || !source) return null;
  try {
    return builder
      .image(source)
      .width(size)
      .height(size)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}
