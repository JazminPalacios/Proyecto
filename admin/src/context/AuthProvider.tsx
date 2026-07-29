import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { signIn as signInService, signOut as signOutService } from '../services/auth.service';
import { isUserAdmin } from '../services/administradores.service';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Resuelve sesión + estado de administrador de forma coherente.
    async function resolve(next: Session | null) {
      if (!active) return;
      if (next) {
        const admin = await isUserAdmin(next.user.id);
        if (!active) return;
        setSession(next);
        setIsAdmin(admin);
      } else {
        setSession(null);
        setIsAdmin(false);
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      await resolve(data.session);
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void resolve(next);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      signIn: async (email, password) => {
        const nextSession = await signInService(email, password);
        // El login de Supabase pudo ser válido, pero el acceso al panel
        // requiere estar en cafetero.administradores.
        const admin = await isUserAdmin(nextSession.user.id);
        if (!admin) {
          await signOutService();
          throw new Error('Tu cuenta no está autorizada para el panel.');
        }
        setSession(nextSession);
        setIsAdmin(true);
      },
      signOut: async () => {
        await signOutService();
      },
    }),
    [session, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
