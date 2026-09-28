import {
  useMutation,
  useMutationState,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';
import type { MenuItem, MenuItemStatus } from '@/types/menu';
import { resumeMenuItem, stopMenuItem } from './api';
import { menuKeys } from './queries';

export interface StatusChange {
  item: MenuItem;
  status: MenuItemStatus;
}

const mutationKey = ['menu-items', 'change-status'] as const;

function sendStatusChange({ item, status }: StatusChange) {
  return status.kind === 'stopped'
    ? stopMenuItem(item.id, { reason: status.reason, until: status.until })
    : resumeMenuItem(item.id);
}

function setCachedStatus(queryClient: QueryClient, id: string, status: MenuItemStatus) {
  queryClient.setQueriesData<MenuItem[]>({ queryKey: menuKeys.lists() }, (items) =>
    items?.map((item) => (item.id === id ? { ...item, status } : item)),
  );
}

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey,
    mutationFn: sendStatusChange,
    onMutate: async ({ item, status }) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.lists() });
      setCachedStatus(queryClient, item.id, status);
    },
    onError: (_error, { item }) => setCachedStatus(queryClient, item.id, item.status),
    onSettled: async () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        await queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
      }
    },
  });
}

export function useSavingItemIds() {
  return useMutationState({
    filters: { mutationKey, status: 'pending' },
    select: (mutation) => (mutation.state.variables as StatusChange).item.id,
  });
}
