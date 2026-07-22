import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../lib/constants';

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-sand px-4 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-brand">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-ink">Página no encontrada</h1>
        <p className="mt-1 text-sm text-ink-soft">La ruta que buscás no existe en el panel.</p>
        <Link to={ROUTES.dashboard} className="mt-6 inline-block">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
