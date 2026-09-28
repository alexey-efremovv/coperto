import Link from 'next/link';
import { SHOPS, STATUS_KINDS } from '@/types/menu';
import { filtersHref, type MenuFilters } from '../model/filters';
import { FilterLabel } from './FilterLabel';
import { SHOP_LABELS, STATUS_LABELS } from './labels';

interface FilterOption {
  label: string;
  href: string;
  isActive: boolean;
}

export function Filters({ filters }: { filters: MenuFilters }) {
  const shopOptions = [undefined, ...SHOPS].map((shop) => ({
    label: shop ? SHOP_LABELS[shop] : 'Все цеха',
    href: filtersHref({ ...filters, shop }),
    isActive: filters.shop === shop,
  }));

  const statusOptions = [undefined, ...STATUS_KINDS].map((status) => ({
    label: status ? STATUS_LABELS[status] : 'Все статусы',
    href: filtersHref({ ...filters, status }),
    isActive: filters.status === status,
  }));

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      <FilterGroup label="Цех" options={shopOptions} />
      <FilterGroup label="Статус" options={statusOptions} />
    </div>
  );
}

function FilterGroup({ label, options }: { label: string; options: FilterOption[] }) {
  return (
    <nav aria-label={label} className="flex items-center gap-3">
      <span className="text-sm font-medium text-ink/60">{label}</span>
      <div className="flex flex-wrap gap-1 rounded-lg bg-white p-1 ring-1 ring-ink/10">
        {options.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            scroll={false}
            aria-current={option.isActive ? 'true' : undefined}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${option.isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-ink/5'}`}
          >
            <FilterLabel>{option.label}</FilterLabel>
          </Link>
        ))}
      </div>
    </nav>
  );
}
