const MONTHS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
export function formatDate(iso: string): string {
  const [y, m] = iso.split('-').map(Number);
  if (!y || !m) return iso;
  return `${MONTHS[m - 1]} ${y}`;
}
export const pad2 = (n: number) => String(n).padStart(2, '0');
export const hostOf = (url: string) => { try { return new URL(url).host; } catch { return url; } };
