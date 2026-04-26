import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PENDING_ASSIGNMENTS } from '@/data/mockData';
import { DIBadge } from '@/components/school/DIBadge';
import { CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function Plan() {
  const { t } = useTranslation();
  const [sel, setSel] = useState<Set<string>>(new Set());
  const toggle = (id: string) => { const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); setSel(n); };
  const all = sel.size === PENDING_ASSIGNMENTS.length;
  const toggleAll = () => setSel(all ? new Set() : new Set(PENDING_ASSIGNMENTS.map(a => a.id)));
  return (
    <div className="p-4 lg:p-6 space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{t('plan.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('plan.subtitle', { count: PENDING_ASSIGNMENTS.length })}</p>
        </div>
        <button disabled={!sel.size} onClick={() => { toast.success(`Approved ${sel.size} assignments`); setSel(new Set()); }}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 rounded-md bg-gradient-brand text-primary-foreground font-semibold text-sm disabled:opacity-40 hover:shadow-glow transition">
          <CheckCheck className="size-4" /> {t('plan.bulkApprove')} {sel.size > 0 && <span className="num-mono">({sel.size})</span>}
        </button>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left w-10"><input type="checkbox" checked={all} onChange={toggleAll} className="accent-primary size-4" /></th>
              <th className="p-3 text-left">School</th>
              <th className="p-3 text-left">DI</th>
              <th className="p-3 text-left">Teacher</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {PENDING_ASSIGNMENTS.map(a => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface-elevated transition">
                <td className="p-3"><input type="checkbox" checked={sel.has(a.id)} onChange={() => toggle(a.id)} className="accent-primary size-4" /></td>
                <td className="p-3"><div className="font-semibold">{a.school.name}</div><div className="text-xs text-muted-foreground">{a.school.block}</div></td>
                <td className="p-3"><DIBadge score={a.school.di} level={a.school.level} size="sm" /></td>
                <td className="p-3 font-medium">{a.teacher.name}</td>
                <td className="p-3 font-mono text-xs">{a.teacher.subject}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{a.proposedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
