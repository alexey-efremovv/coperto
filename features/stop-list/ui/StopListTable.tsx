import { AnimatePresence, motion } from 'framer-motion';
import { useId } from 'react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { MenuItem } from '@/types/menu';
import { formatUntil, SHOP_LABELS, STATUS_LABELS, STOP_REASON_LABELS } from './labels';

interface StopListTableProps {
  items: MenuItem[];
  savingIds: string[];
  isRefreshing: boolean;
  onEditStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
}

export function StopListTable({
  items,
  savingIds,
  isRefreshing,
  onEditStop,
  onResume,
}: StopListTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-ink/10">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="text-xs text-ink/50 uppercase">
          <tr>
            <th scope="col" className="px-5 py-3 font-medium">
              Позиция
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Цех
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Остаток
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Статус
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              <span className="sr-only">Действия</span>
              {isRefreshing && <span className="animate-pulse">Обновляем…</span>}
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {items.map((item) => (
              <StopListRow
                key={item.id}
                item={item}
                isSaving={savingIds.includes(item.id)}
                onEditStop={onEditStop}
                onResume={onResume}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

interface StopListRowProps {
  item: MenuItem;
  isSaving: boolean;
  onEditStop: (item: MenuItem) => void;
  onResume: (item: MenuItem) => void;
}

function StopListRow({ item, isSaving, onEditStop, onResume }: StopListRowProps) {
  const { status } = item;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`border-t border-ink/5 transition-colors ${status.kind === 'stopped' ? 'bg-canvas/60 text-ink/50' : ''}`}
    >
      <td className="px-5 py-3 font-medium">{item.title}</td>
      <td className="px-5 py-3">{SHOP_LABELS[item.shop]}</td>
      <td className="px-5 py-3 tabular-nums">{item.stock} шт.</td>
      <td className="px-5 py-3">
        <motion.div
          key={status.kind}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-1"
        >
          {status.kind === 'stopped' ? (
            <>
              <Badge tone="danger">{STOP_REASON_LABELS[status.reason]}</Badge>
              <span className="text-xs">{formatUntil(status.until)}</span>
            </>
          ) : (
            <Badge tone="success">{STATUS_LABELS.available}</Badge>
          )}
        </motion.div>
      </td>
      <td className="px-5 py-3">
        <RowActions item={item} isSaving={isSaving} onEditStop={onEditStop} onResume={onResume} />
      </td>
    </motion.tr>
  );
}

function RowActions({ item, isSaving, onEditStop, onResume }: StopListRowProps) {
  const hintId = useId();

  if (isSaving) {
    return (
      <div className="flex justify-end">
        <Button isLoading>Сохраняется…</Button>
      </div>
    );
  }

  if (item.status.kind === 'available') {
    return (
      <div className="flex justify-end">
        <Button onClick={() => onEditStop(item)}>Поставить в стоп</Button>
      </div>
    );
  }

  const isOutOfStock = item.stock === 0;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button onClick={() => onEditStop(item)}>Изменить</Button>
        <Button
          variant="primary"
          disabled={isOutOfStock}
          aria-describedby={isOutOfStock ? hintId : undefined}
          onClick={() => onResume(item)}
        >
          Вернуть в продажу
        </Button>
      </div>
      {isOutOfStock && (
        <p id={hintId} className="text-xs">
          Остаток 0 — вернуть в продажу нельзя
        </p>
      )}
    </div>
  );
}
