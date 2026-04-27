import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ClipboardList, Sparkles, School2, Users, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const role = user?.role || 'collector';

  const items = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
  ];
  
  if (role === 'collector') {
    items.push(
      { to: '/deploy', icon: UserPlus, label: t('nav.deploy') },
      { to: '/plan', icon: ClipboardList, label: t('nav.plan') },
      { to: '/briefing', icon: Sparkles, label: t('nav.briefing') }
    );
  }

  const secondary = [];
  if (role === 'collector') {
    secondary.push(
      { to: '/schools', icon: School2, label: t('nav.schools') },
      { to: '/teachers', icon: Users, label: t('nav.teachers') },
      { to: '/verify', icon: BadgeCheck, label: 'Field Verify' }
    );
  } else if (role === 'school') {
     secondary.push(
       { to: '/teachers', icon: Users, label: 'My Teachers' }
     );
  }

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-gradient-brand grid place-items-center shadow-glow">
            <span className="font-bold text-white text-sm">EA</span>
          </div>
          <div>
            <div className="font-bold text-foreground text-[15px] leading-tight">{t('app.name')}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">v1.0 · Apr 2026</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Operations</div>
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${isActive ? 'bg-primary/15 text-primary border border-primary/25 shadow-glow' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground border border-transparent'}`
          }>
            <Icon className="size-[18px]" /> <span className="truncate">{label}</span>
          </NavLink>
        ))}
        {secondary.length > 0 && (
          <>
            <div className="px-2 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Records</div>
            {secondary.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${isActive ? 'bg-sidebar-accent text-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'}`
              }>
                <Icon className="size-[18px]" /> <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-md bg-surface-elevated p-3 border border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            {role === 'collector' ? 'Officer' : role === 'school' ? 'Administration' : 'Faculty'}
          </div>
          <div className="text-sm font-semibold">{user?.name || 'Loading...'}</div>
          <div className="text-xs text-muted-foreground capitalize">{role} Profile</div>
        </div>
      </div>
    </aside>
  );
}
