import { z } from 'zod';
import { SHOPS, STATUS_KINDS } from '@/types/menu';

const filtersSchema = z.object({
  shop: z.enum(SHOPS).optional().catch(undefined),
  status: z.enum(STATUS_KINDS).optional().catch(undefined),
});

export type MenuFilters = z.infer<typeof filtersSchema>;

export function parseFilters(params: Record<string, unknown>): MenuFilters {
  return filtersSchema.parse(params);
}

export function toSearchParams({ shop, status }: MenuFilters) {
  const params = new URLSearchParams();
  if (shop) params.set('shop', shop);
  if (status) params.set('status', status);
  return params;
}

export function filtersHref(filters: MenuFilters) {
  const query = toSearchParams(filters).toString();
  return query ? `/?${query}` : '/';
}
