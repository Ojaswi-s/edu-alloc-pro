import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TEACHERS, SCHOOLS } from '@/data/mockData';
import { useLocation } from 'react-router-dom';
import { MapPin, Award, Clock, AlertTriangle, Check, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Deploy() {
  const { t } = useTranslation();
  const loc = useLocation() as any;
  const school = loc.state?.school ?? SCHOOLS[0];
  const [approved, setApproved] = useState<string | null>(null);

  const approve = (teacherId: string, name: string) => {
    setApproved(teacherId);
    let undone = false;
    const tid = setTimeout(() => { if (!undone) setApproved(prev => prev === teacherId ? null : prev); }, 30000);
    toast.success(t('deploy.deployed'), {
      description: name,
      duration: 30000,
      action: { label: t('deploy.undo'), onClick: () => { undone = true; clearTimeout(tid); setApproved(null); } },
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('deploy.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('deploy.subtitle', { school: school.name })}</p>
      </div>
      <div className="grid gap-3">
        {TEACHERS.map((teacher, i) => {
          const isApproved = approved === teacher.id;
          return (
            <div key={teacher.id} className={`rounded-lg border p-5 transition-all ${isApproved ? 'bg-success/5 border-success/40' : 'bg-card border-border hover:border-primary/30'} animate-fade-up`} style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start gap-4 flex-wrap">
                <div className="num-mono text-3xl font-bold text-muted-foreground/60 w-10">#{i + 1}</div>
                <div className="size-12 rounded-full bg-gradient-brand grid place-items-center text-white font-bold shrink-0">{teacher.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-[200px]">
                  <div className="font-semibold text-base">{teacher.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{teacher.subject} · {teacher.experience}y exp · {teacher.currentPosting}</div>
                  {teacher.retentionScore < 55 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-warning bg-warning/10 border border-warning/30 px-2 py-1 rounded">
                      <AlertTriangle className="size-3" /> Retention risk · pair with TSP allowance
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 min-w-[260px]">
                  {[
                    { i: Award, l: t('deploy.matchScore'), v: teacher.matchScore, color: 'text-accent-teal' },
                    { i: MapPin, l: t('deploy.distance'), v: `${teacher.distance}km`, color: 'text-primary' },
                    { i: Clock, l: t('deploy.retention'), v: teacher.retentionScore, color: teacher.retentionScore < 55 ? 'text-warning' : 'text-success' },
                  ].map((m, j) => (
                    <div key={j}>
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><m.i className="size-3" /> {m.l}</div>
                      <div className={`num-mono text-xl font-bold ${m.color}`}>{m.v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => approve(teacher.id, teacher.name)} disabled={isApproved}
                  className={`min-h-[48px] inline-flex items-center justify-center gap-2 px-5 rounded-md font-semibold text-sm transition ${isApproved ? 'bg-success/20 text-success border border-success/40' : 'bg-gradient-brand text-primary-foreground hover:shadow-glow'}`}>
                  {isApproved ? <><Check className="size-4" /> Approved</> : t('deploy.approve')}
                </button>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-surface-mid overflow-hidden">
                <div className="h-full bg-accent-teal transition-all" style={{ width: `${teacher.matchScore}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
