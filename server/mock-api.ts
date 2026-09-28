import type { MenuItem } from '@/types/menu';

export const LIST_DELAY_MS = 800;
export const MUTATION_DELAY_MS = 600;

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRandomFailure() {
  return Math.random() < 0.2;
}

export function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export function failedToSave(item: MenuItem) {
  return errorResponse(`Не удалось сохранить «${item.title}». Попробуйте ещё раз`, 500);
}
