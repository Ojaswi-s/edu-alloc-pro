import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserPlus, ClipboardList, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MobileNav() {
  const { t } = useTranslation();
  const items = [
    { to: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/deploy', icon: UserPlus, label: t('nav.deploy') },
    { to: '/plan', icon: ClipboardList, label: t('nav.plan') },
    { to: '/briefing', icon: Sparkles, label: t('nav.briefing') },
  ];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl">
      <div className="grid grid-cols-4">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 min-h-[48px] py-2 px-1 text-[11px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`
          }>
            <Icon className="size-5" /> <span className="truncate max-w-full">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
