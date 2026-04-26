import { useTranslation } from 'react-i18next';
import { AlertTriangle, Briefcase, ShieldAlert, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { STATS } from '@/data/mockData';

const cards = (t: any) => [
  { label: t('dashboard.vacancies'), value: STATS.vacancies, delta: '+12', trend: 'up' as const, icon: Briefcase, accent: 'text-primary', bg: 'bg-primary/10', ring: 'border-primary/30' },
  { label: t('dashboard.critical'), value: STATS.criticalSchools, delta: '+3', trend: 'up' as const, icon: AlertTriangle, accent: 'text-di-critical', bg: 'bg-di-critical/10', ring: 'border-di-critical/30' },
  { label: t('dashboard.rte'), value: STATS.rteViolations, delta: '-8', trend: 'down' as const, icon: ShieldAlert, accent: 'text-warning', bg: 'bg-warning/10', ring: 'border-warning/30' },
  { label: t('dashboard.deployments'), value: STATS.deploymentsThisWeek, delta: '+23', trend: 'up' as const, icon: CheckCircle2, accent: 'text-success', bg: 'bg-success/10', ring: 'border-success/30' },
];

export function StatCards() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards(t).map((c, i) => (
        <div key={i} className={`stat-card rounded-lg p-4 relative overflow-hidden border ${c.ring} animate-fade-up`} style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-start justify-between mb-3">
            <div className={`size-10 rounded-md grid place-items-center ${c.bg}`}><c.icon className={`size-5 ${c.accent}`} /></div>
            <div className={`flex items-center gap-1 text-[11px] font-mono px-1.5 py-0.5 rounded ${c.trend === 'up' ? 'text-di-critical bg-di-critical/10' : 'text-success bg-success/10'}`}>
              {c.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {c.delta}
            </div>
          </div>
          <div className="num-mono text-3xl font-bold tracking-tight">{c.value.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
