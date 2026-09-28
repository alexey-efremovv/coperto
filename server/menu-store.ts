import type { MenuFilters } from '@/features/stop-list/model/filters';
import type { MenuItem, MenuItemStatus } from '@/types/menu';

const available: MenuItemStatus = { kind: 'available' };

const seed: Omit<MenuItem, 'updatedAt'>[] = [
  { id: 'borscht', title: 'Борщ с говядиной', shop: 'kitchen', stock: 18, status: available },
  { id: 'caesar', title: 'Цезарь с курицей', shop: 'kitchen', stock: 12, status: available },
  {
    id: 'ribeye',
    title: 'Стейк рибай',
    shop: 'kitchen',
    stock: 0,
    status: { kind: 'stopped', reason: 'out_of_stock', until: null },
  },
  { id: 'carbonara', title: 'Паста карбонара', shop: 'kitchen', stock: 9, status: available },
  {
    id: 'salmon',
    title: 'Лосось на гриле',
    shop: 'kitchen',
    stock: 4,
    status: { kind: 'stopped', reason: 'quality', until: null },
  },
  {
    id: 'okroshka',
    title: 'Окрошка на квасе',
    shop: 'kitchen',
    stock: 7,
    status: { kind: 'stopped', reason: 'menu_change', until: null },
  },
  {
    id: 'espresso',
    title: 'Эспрессо',
    shop: 'bar',
    stock: 50,
    status: { kind: 'stopped', reason: 'equipment', until: null },
  },
  { id: 'tea', title: 'Облепиховый чай', shop: 'bar', stock: 20, status: available },
  { id: 'lemonade', title: 'Лимонад тархун', shop: 'bar', stock: 14, status: available },
  {
    id: 'mojito',
    title: 'Мохито безалкогольный',
    shop: 'bar',
    stock: 0,
    status: { kind: 'stopped', reason: 'out_of_stock', until: null },
  },
  { id: 'beer', title: 'Крафтовое пиво', shop: 'bar', stock: 40, status: available },
  { id: 'napoleon', title: 'Торт «Наполеон»', shop: 'pastry', stock: 6, status: available },
  { id: 'cheesecake', title: 'Чизкейк Нью-Йорк', shop: 'pastry', stock: 3, status: available },
  { id: 'eclair', title: 'Эклер ванильный', shop: 'pastry', stock: 11, status: available },
  { id: 'medovik', title: 'Медовик', shop: 'pastry', stock: 8, status: available },
];

const items: MenuItem[] = seed.map((item) => ({ ...item, updatedAt: new Date().toISOString() }));

export function getMenuItems({ shop, status }: MenuFilters): MenuItem[] {
  return items.filter(
    (item) => (!shop || item.shop === shop) && (!status || item.status.kind === status),
  );
}

export function findMenuItem(id: string): MenuItem | undefined {
  return items.find((item) => item.id === id);
}

export function setMenuItemStatus(item: MenuItem, status: MenuItemStatus): MenuItem {
  item.status = status;
  item.updatedAt = new Date().toISOString();
  return item;
}
