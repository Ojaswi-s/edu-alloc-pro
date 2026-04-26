import type { School } from '@/data/mockData';
import { DIBadge } from './DIBadge';
import { ShieldAlert, MapPin, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const borderColor = {
  critical: 'border-l-di-critical', high: 'border-l-di-high',
  moderate: 'border-l-di-moderate', stable: 'border-l-di-stable',
};

export function SchoolCard({ school, rank, onClick, selected }: { school: School; rank: number; onClick: () => void; selected?: boolean }) {
  const { t } = useTranslation();
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-lg bg-card border border-border ${borderColor[school.level]} border-l-[3px] p-4 hover:border-primary/40 hover:bg-surface-elevated transition-all group ${selected ? 'ring-1 ring-primary border-primary/60 shadow-glow' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="num-mono text-2xl font-bold text-muted-foreground/60 group-hover:text-primary transition w-8 shrink-0">#{rank}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="font-semibold text-sm leading-tight truncate">{school.name}</div>
            <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-primary transition" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2.5">
            <MapPin className="size-3" /> {school.village}, {school.block}
            <span className="opacity-50">·</span>
            <span className="font-mono">{school.udise.slice(-6)}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DIBadge score={school.di} level={school.level} size="sm" />
            {school.rteViolation && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-destructive/15 text-destructive border border-destructive/30">
                <ShieldAlert className="size-3" /> RTE
              </span>
            )}
            {(['PHY', 'CHM', 'MAT'] as const).map(s => school.vacancies[s] > 0 && (
              <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-mid border border-border">
                {s} <span className="text-di-critical font-bold">−{school.vacancies[s]}</span>
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="num-mono">{school.pupils} {t('school.pupils')}</span>
            <span className="opacity-40">·</span>
            <span className="num-mono">PTR {school.ptr}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
