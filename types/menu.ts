export const SHOPS = ['kitchen', 'bar', 'pastry'] as const;
export type Shop = (typeof SHOPS)[number];

export const STOP_REASONS = ['out_of_stock', 'equipment', 'quality', 'menu_change'] as const;
export type StopReason = (typeof STOP_REASONS)[number];

export type MenuItemStatus =
  { kind: 'available' } | { kind: 'stopped'; reason: StopReason; until: string | null };

export type MenuItemStatusKind = MenuItemStatus['kind'];
export const STATUS_KINDS: readonly MenuItemStatusKind[] = ['available', 'stopped'];

export interface MenuItem {
  id: string;
  title: string;
  shop: Shop;
  stock: number;
  status: MenuItemStatus;
  updatedAt: string;
}

export interface StopItemPayload {
  reason: StopReason;
  until: string | null;
}
