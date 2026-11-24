import type { APIRoute } from 'astro';

/**
 * The list of pages for search engines, served at /sitemap.xml.
 * Written by hand because the site has seven pages. The "page not found" page is left out on purpose.
 */
const pages = ['/', '/research/', '/publications/', '/teaching/', '/about/', '/cv/', '/contact/'];

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
