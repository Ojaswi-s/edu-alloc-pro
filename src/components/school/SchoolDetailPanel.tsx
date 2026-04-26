import type { School } from '@/data/mockData';
import { useTranslation } from 'react-i18next';
import { X, ShieldAlert, Calendar, Users, GraduationCap, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { DIBadge } from './DIBadge';
import { Link } from 'react-router-dom';

export function SchoolDetailPanel({ school, onClose }: { school: School | null; onClose: () => void }) {
  const { t } = useTranslation();
  if (!school) return null;
  const subjects = (['PHY', 'CHM', 'MAT'] as const);
  return (
    <>
      <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed lg:absolute inset-y-0 right-0 w-full sm:w-[420px] bg-surface border-l border-border z-50 flex flex-col animate-slide-in-right shadow-elevated">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-border">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">UDISE+ {school.udise}</div>
            <h2 className="font-bold text-lg leading-tight mt-1 truncate">{school.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <MapPin className="size-3" /> {school.village}, {school.block}
            </div>
          </div>
          <button onClick={onClose} className="size-8 grid place-items-center rounded-md border border-border hover:border-primary/50 transition shrink-0"><X className="size-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            <DIBadge score={school.di} level={school.level} size="lg" />
            {school.rteViolation && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold bg-destructive/15 text-destructive border border-destructive/40">
                <ShieldAlert className="size-4" /> {t('school.rteViolation')}
              </span>
            )}
          </div>

          <div className="rounded-lg bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{t('school.dvs')}</span>
              <span className="num-mono text-2xl font-bold text-accent-teal">{school.dvs}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-mid overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-accent-teal to-primary transition-all" style={{ width: `${school.dvs}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-2">Higher DVS = better deployment ROI for this school</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2.5">{t('school.vacancies')}</div>
            <div className="grid grid-cols-3 gap-2">
              {subjects.map(s => (
                <div key={s} className={`rounded-md p-3 border ${school.vacancies[s] > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
                  <div className="text-[10px] font-mono uppercase tracking-wider opacity-70">{s}</div>
                  <div className={`num-mono text-2xl font-bold ${school.vacancies[s] > 0 ? 'text-destructive' : 'text-success'}`}>
                    {school.vacancies[s] > 0 ? `−${school.vacancies[s]}` : '0'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { i: Users, l: t('school.pupils'), v: school.pupils },
              { i: GraduationCap, l: t('school.teachers'), v: school.teachers },
              { i: Users, l: t('school.ratio'), v: school.ptr },
            ].map((m, i) => (
              <div key={i} className="rounded-md p-3 bg-card border border-border">
                <m.i className="size-3.5 text-muted-foreground mb-1" />
                <div className="num-mono text-lg font-bold">{m.v}</div>
                <div className="text-[10px] text-muted-foreground">{m.l}</div>
              </div>
            ))}
          </div>

          <div className="rounded-md p-3 bg-warning/5 border border-warning/30 flex items-start gap-2.5">
            <Calendar className="size-4 text-warning mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-warning">{t('school.udise')}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{t('school.updated')}: <span className="font-mono text-foreground">{school.lastUpdated}</span></div>
            </div>
            <button className="text-[10px] uppercase tracking-wider text-warning font-semibold flex items-center gap-1 hover:underline">Verify <ExternalLink className="size-3" /></button>
          </div>
        </div>

        <div className="p-5 border-t border-border space-y-2">
          <Link to="/deploy" state={{ school }} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-gradient-brand text-primary-foreground font-semibold text-sm hover:shadow-glow transition-all min-h-[48px]">
            <Sparkles className="size-4" /> {t('school.deployTeacher')}
          </Link>
          <Link to="/briefing" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-border hover:border-primary/50 transition text-sm font-medium min-h-[44px]">
            {t('school.viewBriefing')}
          </Link>
        </div>
      </aside>
    </>
  );
}
