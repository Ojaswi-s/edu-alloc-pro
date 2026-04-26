import type { DILevel } from '@/data/mockData';
import { useTranslation } from 'react-i18next';

const cfg: Record<DILevel, { bg: string; fg: string; label: string }> = {
  critical: { bg: 'bg-di-critical/15 border-di-critical/40', fg: 'text-di-critical', label: 'critical' },
  high: { bg: 'bg-di-high/15 border-di-high/40', fg: 'text-di-high', label: 'high' },
  moderate: { bg: 'bg-di-moderate/15 border-di-moderate/40', fg: 'text-di-moderate', label: 'moderate' },
  stable: { bg: 'bg-di-stable/15 border-di-stable/40', fg: 'text-di-stable', label: 'stable' },
};

export function DIBadge({ score, level, size = 'md' }: { score: number; level: DILevel; size?: 'sm' | 'md' | 'lg' }) {
  const { t } = useTranslation();
  const c = cfg[level];
  const pad = size === 'lg' ? 'px-3 py-1.5 text-sm' : size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border font-mono font-semibold uppercase tracking-wider ${pad} ${c.bg} ${c.fg}`}>
      <span className="num-mono">DI {score}</span>
      <span className="opacity-70">·</span>
      <span>{t(`school.${c.label}`)}</span>
    </span>
  );
}
