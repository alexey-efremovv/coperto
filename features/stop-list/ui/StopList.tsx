'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';
import type { MenuFilters } from '../model/filters';
import { useStopPanel } from '../model/panel-store';
import { menuListQuery } from '../model/queries';
import { useChangeStatus, useSavingItemIds } from '../model/use-change-status';
import { StopListTable } from './StopListTable';
import { StopReasonPanel } from './StopReasonPanel';

export function StopList({ filters }: { filters: MenuFilters }) {
  const { data: items, error, isFetching, refetch } = useQuery(menuListQuery(filters));
  const savingIds = useSavingItemIds();
  const changeStatus = useChangeStatus();
  const panelItemId = useStopPanel((state) => state.itemId);
  const openPanel = useStopPanel((state) => state.open);
  const closePanel = useStopPanel((state) => state.close);

  if (!items) {
    if (!error) return <ListSkeleton />;

    return (
      <ListMessage title="Не удалось загрузить меню" description={error.message}>
        <Button isLoading={isFetching} onClick={() => refetch()}>
          {isFetching ? 'Загружаем…' : 'Повторить'}
        </Button>
      </ListMessage>
    );
  }

  if (items.length === 0) {
    return (
      <ListMessage title="Ничего не найдено" description="По выбранным фильтрам позиций нет">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          Сбросить фильтры
        </Link>
      </ListMessage>
    );
  }

  return (
    <>
      <StopListTable
        items={items}
        savingIds={savingIds}
        isRefreshing={isFetching}
        onEditStop={(item) => openPanel(item.id)}
        onResume={(item) => changeStatus.mutate({ item, status: { kind: 'available' } })}
      />
      <StopReasonPanel item={items.find((item) => item.id === panelItemId)} onClose={closePanel} />
    </>
  );
}

function ListSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-2 rounded-xl bg-white p-4 ring-1 ring-ink/10">
      <span className="sr-only">Загружаем меню…</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-lg bg-ink/5" />
      ))}
    </div>
  );
}

interface ListMessageProps {
  title: string;
  description: string;
  children: ReactNode;
}

function ListMessage({ title, description, children }: ListMessageProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-6 py-12 text-center ring-1 ring-ink/10">
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-ink/60">{description}</p>
      </div>
      {children}
    </div>
  );
}
