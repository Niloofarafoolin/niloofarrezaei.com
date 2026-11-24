/**
 * The owner's portrait is optional. If src/assets/headshot.(jpg|jpeg|png|webp) exists,
 * the site shows it on the home and About pages. If it does not, nothing is shown
 * and the site still builds.
 */
import type { ImageMetadata } from 'astro';

const found = import.meta.glob<{ default: ImageMetadata }>('../assets/headshot.{jpg,jpeg,png,webp}', {
  eager: true,
});

export const portrait: ImageMetadata | null = Object.values(found)[0]?.default ?? null;
export const portraitAlt = 'Portrait of Niloofar Rezaei in a black top, against a light wall.';
