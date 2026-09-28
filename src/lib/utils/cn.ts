import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format số theo chuẩn Việt Nam:
 * - Dấu chấm (.) phân tách nghìn: 1.000.000
 * - Dấu phẩy (,) phân tách thập phân: 1,5
 * Chuẩn TCVN 6927 / quy ước Nghị định 20/2023.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
}

/**
 * Rút gọn cho đời thường: 1.250.000 → "1,25 triệu", 2.500.000.000 → "2,5 tỷ"
 * Dùng trong UI gọn (breakdown, nhãn) để tránh dãy số dài vỡ layout trên mobile.
 */
export function formatVNDShort(num: number): string {
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000) return `${formatNumber(num / 1_000_000_000)} tỷ`;
  if (abs >= 1_000_000) return `${formatNumber(num / 1_000_000)} triệu`;
  if (abs >= 1_000) return `${formatNumber(num / 1_000)} nghìn`;
  return formatNumber(num);
}

export function getDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
