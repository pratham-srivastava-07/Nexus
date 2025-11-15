import crypto from 'crypto';

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function safeJsonParse<T = unknown>(input: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) {
  const out = {} as Pick<T, K>;
  for (const k of keys) if (k in obj) out[k] = obj[k];
  return out;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]) {
  const out = { ...obj } as Record<string, unknown>;
  for (const k of keys) delete out[k as string];
  return out as Omit<T, K>;
}

export function isEmpty(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v as Record<string, unknown>).length === 0;
  return false;
}

export function nowISO() {
  return new Date().toISOString();
}

export function generateId() {
  // Prefer crypto.randomUUID when available
  // @ts-ignore
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // fallback
  return crypto.randomBytes(16).toString('hex');
}
