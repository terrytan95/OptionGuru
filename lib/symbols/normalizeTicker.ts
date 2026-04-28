export function normalizeTicker(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, "");
}

export function isValidTicker(input: string): boolean {
  return /^[A-Z0-9.-]{1,12}$/.test(normalizeTicker(input));
}
