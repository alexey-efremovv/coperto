import { findMenuItem, setMenuItemStatus } from '@/server/menu-store';
import {
  delay,
  errorResponse,
  failedToSave,
  isRandomFailure,
  MUTATION_DELAY_MS,
} from '@/server/mock-api';

export async function POST(_request: Request, ctx: RouteContext<'/api/menu-items/[id]/resume'>) {
  await delay(MUTATION_DELAY_MS);

  const { id } = await ctx.params;
  const item = findMenuItem(id);
  if (!item) return errorResponse('Позиция не найдена', 404);

  if (item.stock === 0) {
    return errorResponse(`«${item.title}» нельзя вернуть в продажу: остаток 0`, 409);
  }

  if (isRandomFailure()) return failedToSave(item);

  return Response.json(setMenuItemStatus(item, { kind: 'available' }));
}
