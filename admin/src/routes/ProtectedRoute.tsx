import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingBlock } from '../components/ui/Spinner';
import { ROUTES } from '../lib/constants';

export function ProtectedRoute() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-sand">
        <LoadingBlock label="Verificando sesión…" />
      </div>
    );
  }

  // Sin sesión o sin ser administrador autorizado → al login.
  if (!session || !isAdmin) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
