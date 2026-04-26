import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatCards } from '@/components/dashboard/StatCards';
import { SchoolMap } from '@/components/dashboard/SchoolMap';
import { SchoolCard } from '@/components/school/SchoolCard';
import { SchoolDetailPanel } from '@/components/school/SchoolDetailPanel';
import { SCHOOLS, type School } from '@/data/mockData';
import { Filter, ArrowUpDown } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<School | null>(null);
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('dashboard.district')} · 847 schools · 6 blocks</p>
        </div>
      </div>
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 relative">
        <div className="lg:col-span-3 relative">
          <SchoolMap onSelect={setSelected} selectedId={selected?.id} />
        </div>
        <div className="lg:col-span-2 flex flex-col rounded-lg bg-card border border-border max-h-[680px]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('dashboard.rankedSchools')}</div>
              <div className="text-sm font-semibold mt-0.5">Top priority · sorted by DI</div>
            </div>
            <div className="flex gap-1.5">
              <button className="size-8 grid place-items-center rounded-md border border-border hover:border-primary/50"><Filter className="size-3.5" /></button>
              <button className="size-8 grid place-items-center rounded-md border border-border hover:border-primary/50"><ArrowUpDown className="size-3.5" /></button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {SCHOOLS.slice(0, 30).map((s, i) => (
              <SchoolCard key={s.id} school={s} rank={i + 1} onClick={() => setSelected(s)} selected={selected?.id === s.id} />
            ))}
          </div>
          <div className="p-3 border-t border-border text-center">
            <button className="text-xs text-primary font-semibold hover:underline">{t('dashboard.seeAll')} →</button>
          </div>
        </div>
        {selected && <SchoolDetailPanel school={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
