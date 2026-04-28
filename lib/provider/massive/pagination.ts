export function getNextUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "next_url" in value) {
    const nextUrl = (value as { next_url?: unknown }).next_url;
    return typeof nextUrl === "string" ? nextUrl : null;
  }
  return null;
}
