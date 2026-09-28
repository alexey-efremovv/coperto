import { stopItemSchema } from '@/features/stop-list/model/stop-schema';
import { findMenuItem, setMenuItemStatus } from '@/server/menu-store';
import {
  delay,
  errorResponse,
  failedToSave,
  isRandomFailure,
  MUTATION_DELAY_MS,
} from '@/server/mock-api';

export async function POST(request: Request, ctx: RouteContext<'/api/menu-items/[id]/stop'>) {
  await delay(MUTATION_DELAY_MS);

  const { id } = await ctx.params;
  const item = findMenuItem(id);
  if (!item) return errorResponse('Позиция не найдена', 404);

  const payload = stopItemSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) return errorResponse(payload.error.issues[0].message, 400);

  if (isRandomFailure()) return failedToSave(item);

  return Response.json(setMenuItemStatus(item, { kind: 'stopped', ...payload.data }));
}
