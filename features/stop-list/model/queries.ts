import { queryOptions } from '@tanstack/react-query';
import { fetchMenuItems } from './api';
import type { MenuFilters } from './filters';

export const menuKeys = {
  lists: () => ['menu-items', 'list'] as const,
  list: (filters: MenuFilters) => [...menuKeys.lists(), filters] as const,
};

export function menuListQuery(filters: MenuFilters) {
  return queryOptions({
    queryKey: menuKeys.list(filters),
    queryFn: ({ signal }) => fetchMenuItems(filters, signal),
  });
}
