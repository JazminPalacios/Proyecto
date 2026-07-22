import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingBlock } from '../components/ui/Spinner';
import { ROUTES } from '../lib/constants';

export function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid h-screen place-items-center bg-sand">
        <LoadingBlock label="Verificando sesión…" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
