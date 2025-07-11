// utils.ts
/**
 * URL base de la API.  Ajusta en .env.local si no usas localhost:8000
 *   VITE_API_BASE_URL=https://tu-dominio.com
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/**  
 * Devuelve una URL de imagen válida.
 * - Si ya es absoluta → la deja tal cual.
 * - Si empieza por “/” → la concatena con API_BASE.
 * - Si viene `undefined` → usa el *fallback*.
 */
export function resolveImage(url: string | undefined, fallback: string) {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url; // absoluta
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
