export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function toFileUrl(p?: string | null) {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  return `${BACKEND_BASE_URL}${p}`;
}
