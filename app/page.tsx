import { parseFilters } from '@/features/stop-list/model/filters';
import { Filters } from '@/features/stop-list/ui/Filters';
import { StopList } from '@/features/stop-list/ui/StopList';

export default async function Page({ searchParams }: PageProps<'/'>) {
  const filters = parseFilters(await searchParams);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Стоп-лист</h1>
        <p className="mt-1 text-ink/60">
          Меню текущей смены: снимайте позиции с продажи и возвращайте их обратно
        </p>
      </header>
      <Filters filters={filters} />
      <StopList filters={filters} />
    </main>
  );
}
