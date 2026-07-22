import { Menu, PanelLeft, LogOut } from 'lucide-react';
import { Avatar } from './Avatar';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function Header({ onToggleMobile, onToggleCollapse, onLogout }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-white/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMobile}
          className="grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-black/5 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-black/5 md:grid"
          aria-label="Colapsar menú"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[200px] truncate text-sm font-medium text-ink">{user?.email}</p>
          <p className="text-xs text-ink-soft">Administrador</p>
        </div>
        <Avatar email={user?.email} />
        <Button variant="secondary" size="sm" onClick={onLogout}>
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </Button>
      </div>
    </header>
  );
}
