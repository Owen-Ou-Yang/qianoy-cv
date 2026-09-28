import type { APIRoute } from 'astro';
import { navigation, profile } from '../data/site';
import { projects } from '../data/projects';
export const GET: APIRoute = () => {
  // Draft project detail pages are noindex and intentionally excluded.
  const paths = [...navigation.map(item => item.href), ...projects.filter(p => !p.isPlaceholder).map(p => `/projects/${p.slug}/`)];
  const urls = paths.map(path => `<url><loc>${new URL(path, profile.siteUrl).href}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
