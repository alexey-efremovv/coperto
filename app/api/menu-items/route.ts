import type { NextRequest } from 'next/server';
import { parseFilters } from '@/features/stop-list/model/filters';
import { getMenuItems } from '@/server/menu-store';
import { delay, LIST_DELAY_MS } from '@/server/mock-api';

export async function GET(request: NextRequest) {
  await delay(LIST_DELAY_MS);

  const filters = parseFilters(Object.fromEntries(request.nextUrl.searchParams));
  return Response.json(getMenuItems(filters));
}
