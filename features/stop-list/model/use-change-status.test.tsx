import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, it, vi } from 'vitest';
import type { MenuItem, MenuItemStatus } from '@/types/menu';
import { menuKeys } from './queries';
import { useChangeStatus } from './use-change-status';

const item: MenuItem = {
  id: 'borscht',
  title: 'Борщ',
  shop: 'kitchen',
  stock: 10,
  status: { kind: 'available' },
  updatedAt: '2026-09-28T09:00:00.000Z',
};

it('сразу меняет статус позиции и откатывает его, если сервер ответил ошибкой', async () => {
  let respond: (response: Response) => void = () => {};
  vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise((resolve) => (respond = resolve)));

  const queryClient = new QueryClient();
  const listKey = menuKeys.list({});
  queryClient.setQueryData(listKey, [item]);
  const cachedStatus = () => queryClient.getQueryData<MenuItem[]>(listKey)?.[0].status;

  const { result } = renderHook(useChangeStatus, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  const stopped: MenuItemStatus = { kind: 'stopped', reason: 'equipment', until: null };
  act(() => result.current.mutate({ item, status: stopped }));

  await waitFor(() => expect(cachedStatus()).toEqual(stopped));

  respond(Response.json({ error: 'Не удалось сохранить' }, { status: 500 }));

  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(cachedStatus()).toEqual({ kind: 'available' });
});
