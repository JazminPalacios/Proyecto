import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Coffee, PackageOpen, Tags, type LucideIcon } from 'lucide-react';
import { ROUTES } from '../../lib/constants';
import { cn } from '../../lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.cafes, label: 'Cafés', icon: Coffee },
  { to: ROUTES.equipos, label: 'Equipos', icon: PackageOpen },
  { to: ROUTES.categorias, label: 'Categorías', icon: Tags },
];

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col bg-brand-dark text-cream transition-all duration-200',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream/10 font-display font-bold">
          EA
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-[.14em]">ENTRE AMIGOS</p>
            <p className="text-[10px] tracking-[.3em] text-cream/60">ADMIN</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive ? 'bg-cream/15 text-cream' : 'text-cream/70 hover:bg-cream/10 hover:text-cream',
                collapsed && 'justify-center'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <p className="px-5 py-4 text-[11px] leading-relaxed text-cream/40">
          Panel de administración
          <br />© {new Date().getFullYear()} Entre Amigos
        </p>
      )}
    </aside>
  );
}
