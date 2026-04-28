import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TEACHERS, SCHOOLS, type Teacher } from '@/data/mockData';
import { Link } from 'react-router-dom';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  Users, Award, MapPin, Clock, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';

type SortKey = 'name' | 'matchScore' | 'retentionScore' | 'distance' | 'experience';

const PAGE_SIZE = 20;

// Extend mock teachers list with generated entries so the page feels full
const SUBJECT_POOL = ['PHY', 'CHM', 'MAT', 'ENG', 'HIN'] as const;
const NAME_POOL = [
  'Priya Deshmukh','Rajesh Patil','Sunita Pawar','Anil Gavit','Kavita Mahajan',
  'Suresh Borse','Anita Sonawane','Vinod Chaudhari','Rekha Valvi','Deepak Tadvi',
  'Smita Nandurkar','Ramesh Bhil','Geeta Aher','Prakash Pawara','Leela Vasave',
  'Santosh Jadhav','Meena Kokane','Vijay Kale','Usha Deore','Hemant Wagh',
  'Lata Shinde','Manoj Suryavanshi','Asha Bhagat','Naresh Padvi','Rohini Gavit',
  'Dilip Mahale','Sanjay Tadvi','Pooja Valvi','Kiran Ahire','Tushar Chavan',
];
const BLOCK_POSTINGS = [
  'ZP School Shahada', 'Govt School Navapur', 'Tribal Ashram Akkalkuwa',
  'GP Taloda', 'Adivasi School Akrani', 'Govt Higher Nandurbar',
  'ZP School Dhadgaon', 'Ashram School Toranmal', 'GP School Bilgaon',
];
const LANG_POOL = [
  ['mr', 'hi', 'en'], ['mr', 'hi'], ['mr', 'bhili'], ['mr'], ['hi', 'en'],
  ['mr', 'te'], ['mr', 'hi', 'bhili'], ['en'],
];

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const ALL_TEACHERS: Teacher[] = (() => {
  const base = [...TEACHERS];
  const r = seededRand(77);
  for (let i = base.length; i < NAME_POOL.length; i++) {
    const exp = 2 + Math.floor(r() * 20);
    base.push({
      id: `T${i + 1}`,
      name: NAME_POOL[i],
      subject: SUBJECT_POOL[Math.floor(r() * SUBJECT_POOL.length)],
      experience: exp,
      experienceLevel: exp > 15 ? 'senior' : exp > 5 ? 'mid' : 'junior',
      status: r() > 0.9 ? 'leave' : r() > 0.8 ? 'transferring' : 'active',
      currentPosting: BLOCK_POSTINGS[Math.floor(r() * BLOCK_POSTINGS.length)],
      distance: 5 + Math.floor(r() * 55),
      matchScore: 50 + Math.floor(r() * 50),
      retentionScore: 30 + Math.floor(r() * 70),
      languages: LANG_POOL[Math.floor(r() * LANG_POOL.length)],
    });
  }
  return base;
})();

const LANG_LABELS: Record<string, string> = {
  mr: 'मराठी', hi: 'हिंदी', en: 'EN', bhili: 'भिली', te: 'తెలుగు',
};

const SUBJECT_COLORS: Record<string, string> = {
  PHY: 'text-primary bg-primary/10 border-primary/30',
  CHM: 'text-accent-teal bg-accent-teal/10 border-accent-teal/30',
  MAT: 'text-warning bg-warning/10 border-warning/30',
  ENG: 'text-success bg-success/10 border-success/30',
  HIN: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

export default function Teachers() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [talukaFilter, setTalukaFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [expLevelFilter, setExpLevelFilter] = useState<string>('all');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('matchScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const TALUKAS = ['Shahada', 'Navapur', 'Akkalkuwa', 'Taloda', 'Akrani', 'Nandurbar', 'Dhadgaon'];

  const filtered = useMemo(() => {
    let list = ALL_TEACHERS;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.currentPosting.toLowerCase().includes(q)
      );
    }
    if (subjectFilter !== 'all') list = list.filter(t => t.subject === subjectFilter);
    if (talukaFilter !== 'all') list = list.filter(t => t.currentPosting.includes(talukaFilter));
    if (riskFilter === 'high') list = list.filter(t => t.retentionScore < 55);
    if (riskFilter === 'safe') list = list.filter(t => t.retentionScore >= 55);
    if (expLevelFilter !== 'all') list = list.filter(t => t.experienceLevel === expLevelFilter);
    if (langFilter !== 'all') list = list.filter(t => t.languages.includes(langFilter));

    return [...list].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [query, subjectFilter, talukaFilter, riskFilter, expLevelFilter, langFilter, sortKey, sortDir]);

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

  // Stats
  const risky = ALL_TEACHERS.filter(t => t.retentionScore < 55).length;
  const avgMatch = Math.round(ALL_TEACHERS.reduce((s, t) => s + t.matchScore, 0) / ALL_TEACHERS.length);
  const avgExp   = Math.round(ALL_TEACHERS.reduce((s, t) => s + t.experience, 0) / ALL_TEACHERS.length);

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="size-7 text-primary" /> {t('nav.teachers')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('dashboard.district')} · {ALL_TEACHERS.length} teachers registered
          </p>
        </div>
      </div>

      {/* Stat chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Teachers', value: ALL_TEACHERS.length, color: 'text-foreground' },
          { label: 'Avg. Match Score', value: `${avgMatch}%`, color: 'text-accent-teal' },
          { label: 'Avg. Experience', value: `${avgExp}y`, color: 'text-primary' },
          { label: 'Retention Risk', value: risky, color: 'text-warning' },
        ].map((s, i) => (
          <div key={i} className="stat-card rounded-lg p-4">
            <div className={`num-mono text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-elevated border border-border flex-1 min-w-[200px] max-w-sm">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
            placeholder="Search teachers, postings…"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
        <select
          value={subjectFilter}
          onChange={e => { setSubjectFilter(e.target.value); setPage(1); }}
          className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition truncate w-32"
        >
          <option value="all">All Subjects</option>
          {SUBJECT_POOL.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={talukaFilter}
          onChange={e => { setTalukaFilter(e.target.value); setPage(1); }}
          className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition truncate w-36"
        >
          <option value="all">All Talukas</option>
          {TALUKAS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={expLevelFilter}
          onChange={e => { setExpLevelFilter(e.target.value); setPage(1); }}
          className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition truncate w-36"
        >
          <option value="all">All Experience</option>
          <option value="junior">Junior (<5y)</option>
          <option value="mid">Mid-Level (5-15y)</option>
          <option value="senior">Senior (15y+)</option>
        </select>
        <select
          value={langFilter}
          onChange={e => { setLangFilter(e.target.value); setPage(1); }}
          className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition truncate w-36"
        >
          <option value="all">All Languages</option>
          {Object.entries(LANG_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
          className="text-sm bg-surface-elevated border border-border rounded-md px-2 py-2 outline-none hover:border-primary/50 transition truncate w-36"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Flight Risk</option>
          <option value="safe">Safe Retention</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-surface-elevated border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-foreground transition">
                  Teacher <SortIcon k="name" />
                </button>
              </th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Current Posting</th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('experience')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  Exp <SortIcon k="experience" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('matchScore')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  <Award className="size-3" /> Match <SortIcon k="matchScore" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('retentionScore')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  <Clock className="size-3" /> Retention <SortIcon k="retentionScore" />
                </button>
              </th>
              <th className="p-3 text-center">
                <button onClick={() => handleSort('distance')} className="flex items-center gap-1 mx-auto hover:text-foreground transition">
                  <MapPin className="size-3" /> Dist <SortIcon k="distance" />
                </button>
              </th>
              <th className="p-3 text-left">Languages</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-muted-foreground">No teachers match your search.</td>
              </tr>
            )}
            {paged.map((teacher, i) => {
              const retentionRisk = teacher.retentionScore < 55;
              return (
                <tr key={teacher.id} className="border-b border-border last:border-0 hover:bg-surface-elevated transition">
                  <td className="p-3 num-mono text-xs text-muted-foreground">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-gradient-brand grid place-items-center text-white font-bold text-xs shrink-0">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{teacher.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{teacher.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block w-fit px-2 py-0.5 rounded border text-[11px] font-bold font-mono ${SUBJECT_COLORS[teacher.subject] ?? 'text-muted-foreground bg-surface-mid border-border'}`}>
                        {teacher.subject}
                      </span>
                      <span className={`text-[10px] uppercase tracking-tighter font-bold ${teacher.status === 'active' ? 'text-success' : 'text-warning'}`}>
                        {teacher.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-xs max-w-[180px] truncate">{teacher.currentPosting}</td>
                  <td className="p-3 text-center num-mono text-sm font-semibold">{teacher.experience}y</td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="num-mono text-sm font-bold text-accent-teal">{teacher.matchScore}</span>
                      <div className="w-12 h-1 rounded-full bg-surface-mid overflow-hidden">
                        <div className="h-full bg-accent-teal transition-all" style={{ width: `${teacher.matchScore}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`num-mono text-sm font-bold ${retentionRisk ? 'text-warning' : 'text-success'}`}>
                        {teacher.retentionScore}
                      </span>
                      {retentionRisk && (
                        <AlertTriangle className="size-3 text-warning" title="Retention risk" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center num-mono text-sm">{teacher.distance}km</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {teacher.languages.map(l => (
                        <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-mid border border-border font-semibold">
                          {LANG_LABELS[l] ?? l.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <Link
                      to="/deploy"
                      state={{ school: SCHOOLS[0] }}
                      className="text-xs font-semibold text-primary hover:underline whitespace-nowrap"
                    >
                      {t('school.deployTeacher')} →
                    </Link>
                  </td>
                </tr>
              );
            })}
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
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
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
    </div>
  );
}
