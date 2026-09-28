import type { MenuItemStatusKind, Shop, StopReason } from '@/types/menu';

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STATUS_LABELS: Record<MenuItemStatusKind, string> = {
  available: 'В продаже',
  stopped: 'В стоп-листе',
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству партии',
  menu_change: 'Выведена из меню смены',
};

const untilFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatUntil(until: string | null) {
  return until === null ? 'до конца смены' : `до ${untilFormat.format(new Date(until))}`;
}
