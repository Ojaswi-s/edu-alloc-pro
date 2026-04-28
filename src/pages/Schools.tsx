import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SCHOOLS, type School, type DILevel } from '@/data/mockData';
import { DIBadge } from '@/components/school/DIBadge';
import { SchoolDetailPanel } from '@/components/school/SchoolDetailPanel';
import { Link } from 'react-router-dom';
import {
  Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  School2, ShieldAlert, Users, GraduationCap, ChevronLeft, ChevronRight,
} from 'lucide-react';

const PAGE_SIZE = 25;
const LEVELS: DILevel[] = ['critical', 'high', 'moderate', 'stable'];
const BLOCKS = ['Akkalkuwa', 'Akrani', 'Nandurbar', 'Navapur', 'Shahada', 'Taloda'];

type SortKey = 'di' | 'name' | 'pupils' | 'teachers' | 'ptr' | 'totalVacancies';

export default function Schools() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<DILevel | 'all'>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [rteOnly, setRteOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('di');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<School | null>(null);

  const filtered = useMemo(() => {
    let list = SCHOOLS;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.udise.includes(q) ||
        s.village.toLowerCase().includes(q) ||
        s.block.toLowerCase().includes(q)
      );
    }
    if (levelFilter !== 'all') list = list.filter(s => s.level === levelFilter);
    if (blockFilter !== 'all') list = list.filter(s => s.block === blockFilter);
    if (rteOnly) list = list.filter(s => s.rteViolation);
    list = [...list].sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [query, levelFilter, blockFilter, rteOnly, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? (sortDir === 'desc' ? <ArrowDown className="size-3.5 text-primary" /> : <ArrowUp className="size-3.5 text-primary" />)
      : <ArrowUpDown className="size-3.5 opacity-40" />;

  const levelColors: Record<DILevel, string> = {
    critical: 'bg-destructive/15 text-destructive border-destructive/30',
    high: 'bg-warning/15 text-warning border-warning/30',
    moderate: 'bg-primary/15 text-primary border-primary/30',
    stable: 'bg-success/15 text-success border-success/30',
  };
  const levelLabels: Record<DILevel, string> = {
    critical: t('school.critical'), high: t('school.high'),
    moderate: t('school.moderate'), stable: t('school.stable'),
  };

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
            <School2 className="size-7 text-primary" /> {t('nav.schools')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('dashboard.district')} · {filtered.length} {filtered.length !== SCHOOLS.length ? `of ${SCHOOLS.length}` : ''} schools
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-elevated border border-border flex-1 min-w-[200px] max-w-sm">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
            placeholder={t('dashboard.search')}
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="size-3.5 text-muted-foreground" />
          <select
            value={levelFilter}
            onChange={e => { setLevelFilter(e.target.value as DILevel | 'all'); setPage(1); }}
            className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition"
          >
            <option value="all">All Levels</option>
            {LEVELS.map(l => <option key={l} value={l}>{levelLabels[l]}</option>)}
          </select>
          <select
            value={blockFilter}
            onChange={e => { setBlockFilter(e.target.value); setPage(1); }}
            className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition"
          >
            <option value="all">All Blocks</option>
            {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button
            onClick={() => { setRteOnly(v => !v); setPage(1); }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition ${rteOnly ? 'bg-destructive/15 border-destructive/40 text-destructive' : 'border-border hover:border-primary/50'}`}
          >
            <ShieldAlert className="size-3.5" /> RTE Only
          </button>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map(l => {
          const count = SCHOOLS.filter(s => s.level === l).length;
          return (
            <button
              key={l}
              onClick={() => { setLevelFilter(levelFilter === l ? 'all' : l); setPage(1); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition ${levelFilter === l ? levelColors[l] : 'border-border text-muted-foreground hover:border-primary/50'}`}
            >
              {levelLabels[l]} <span className="font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-surface-elevated border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-foreground transition">
                  School <SortIcon k="name" />
                </button>
              </th>
              <th className="p-3 text-left">Block</th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('di')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  DI <SortIcon k="di" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('totalVacancies')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  Vacancies <SortIcon k="totalVacancies" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('pupils')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  <Users className="size-3" /> {t('school.pupils')} <SortIcon k="pupils" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('teachers')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  <GraduationCap className="size-3" /> {t('school.teachers')} <SortIcon k="teachers" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('ptr')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  PTR <SortIcon k="ptr" />
                </button>
              </th>
              <th className="p-3 text-left">Medium</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground">No schools match your filters.</td>
              </tr>
            )}
            {paged.map((s, i) => (
              <tr
                key={s.id}
                onClick={() => setSelected(s)}
                className={`border-b border-border last:border-0 transition cursor-pointer ${selected?.id === s.id ? 'bg-primary/5' : 'hover:bg-surface-elevated'}`}
              >
                <td className="p-3 num-mono text-xs text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</td>
                <td className="p-3 max-w-[220px]">
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{s.udise}</div>
                  {s.rteViolation && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-destructive font-semibold mt-0.5">
                      <ShieldAlert className="size-3" /> RTE
                    </span>
                  )}
                </td>
                <td className="p-3 text-xs">{s.block}<div className="text-muted-foreground">{s.village}</div></td>
                <td className="p-3 text-center">
                  <DIBadge score={s.di} level={s.level} size="sm" />
                </td>
                <td className="p-3 text-center">
                  {s.totalVacancies > 0
                    ? <span className="num-mono text-sm font-bold text-destructive">−{s.totalVacancies}</span>
                    : <span className="num-mono text-sm font-bold text-success">0</span>}
                </td>
                <td className="p-3 text-center num-mono text-sm">{s.pupils}</td>
                <td className="p-3 text-center num-mono text-sm">{s.teachers}</td>
                <td className={`p-3 text-center num-mono text-sm font-bold ${s.ptr > 40 ? 'text-destructive' : s.ptr > 30 ? 'text-warning' : 'text-success'}`}>
                  {s.ptr}
                </td>
                <td className="p-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-mid border border-border">{s.medium}</span>
                </td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <Link
                    to="/deploy"
                    state={{ school: s }}
                    className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                  >
                    {t('school.deployTeacher')} →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="size-8 grid place-items-center rounded-md border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`size-8 grid place-items-center rounded-md text-sm transition ${p === page ? 'bg-primary text-primary-foreground font-bold' : 'border border-border hover:border-primary/50'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="size-8 grid place-items-center rounded-md border border-border hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* School detail slide-over */}
      {selected && <SchoolDetailPanel school={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
