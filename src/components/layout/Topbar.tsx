import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/i18n';
import { Bell, Search, Globe, ChevronDown, WifiOff, LogOut, LayoutDashboard, UserPlus, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar({ offline }: { offline: boolean }) {
  const { t, i18n } = useTranslation();
  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="h-16 px-4 lg:px-6 flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="size-8 rounded-md bg-gradient-brand grid place-items-center"><span className="font-bold text-white text-xs">EA</span></div>
          <span className="font-bold text-sm">{t('app.name')}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground uppercase tracking-widest font-mono">{t('dashboard.live')}</span>
          <span className="text-muted-foreground/60">·</span>
          <span className="text-muted-foreground">{t('dashboard.district')}</span>
        </div>
        <div className="flex-1" />
        
        <button 
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-surface-elevated border border-border w-72 text-sm text-muted-foreground hover:border-primary/50 transition cursor-text text-left"
        >
          <Search className="size-4" /> <span className="truncate">{t('dashboard.search')}</span>
          <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-surface-mid font-mono border border-border">⌘K</kbd>
        </button>

        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => { setSearchOpen(false); navigate("/"); }}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Go to Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); navigate("/deploy"); }}>
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Deployment Planner</span>
              </CommandItem>
              <CommandItem onSelect={() => { setSearchOpen(false); navigate("/plan"); }}>
                <FileText className="mr-2 h-4 w-4" />
                <span>District Report</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border hover:border-primary/50 transition text-sm">
              <Globe className="size-4" /> <span className="font-medium">{current.native}</span> <ChevronDown className="size-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            {LANGUAGES.map(l => (
              <DropdownMenuItem key={l.code} onClick={() => i18n.changeLanguage(l.code)}
                className={`flex justify-between gap-4 ${i18n.language === l.code ? 'text-primary' : ''}`}>
                <span>{l.native}</span> <span className="text-xs text-muted-foreground">{l.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <button className="relative size-10 grid place-items-center rounded-md border border-border hover:border-primary/50 transition">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="flex flex-col gap-2">
               <div className="font-semibold text-sm">Notifications</div>
               <div className="text-sm text-muted-foreground p-4 text-center border rounded border-dashed border-border bg-surface-mid">
                  No new notifications right now.
               </div>
            </div>
          </PopoverContent>
        </Popover>

        <button onClick={logout} title="Log out" className="relative size-10 grid place-items-center rounded-md border border-border hover:border-primary/50 transition text-muted-foreground hover:text-destructive">
          <LogOut className="size-4" />
        </button>
      </div>
      {offline && (
        <div className="bg-warning/15 border-t border-warning/30 px-4 py-2 text-warning text-xs font-medium flex items-center gap-2">
          <WifiOff className="size-3.5" /> {t('common.offline')}
        </div>
      )}
    </header>
  );
}
