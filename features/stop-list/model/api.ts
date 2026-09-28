import type { MenuItem, StopItemPayload } from '@/types/menu';
import { toSearchParams, type MenuFilters } from './filters';

type ErrorBody = { error?: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const body: ErrorBody = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Сервер недоступен, попробуйте ещё раз');
  }
  return response.json();
}

export function fetchMenuItems(filters: MenuFilters, signal?: AbortSignal) {
  return request<MenuItem[]>(`/api/menu-items?${toSearchParams(filters)}`, { signal });
}

export function stopMenuItem(id: string, payload: StopItemPayload) {
  return request<MenuItem>(`/api/menu-items/${id}/stop`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function resumeMenuItem(id: string) {
  return request<MenuItem>(`/api/menu-items/${id}/resume`, { method: 'POST' });
}
