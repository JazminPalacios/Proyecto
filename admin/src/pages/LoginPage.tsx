import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { loginSchema, type LoginValues } from '../schemas/login.schema';
import { useAuth } from '../hooks/useAuth';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { getErrorMessage } from '../lib/format';
import { ROUTES } from '../lib/constants';

export function LoginPage() {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Si ya hay sesión, al dashboard.
  useEffect(() => {
    if (!loading && session) navigate(ROUTES.dashboard, { replace: true });
  }, [loading, session, navigate]);

  const onSubmit = async (values: LoginValues) => {
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
      navigate(ROUTES.dashboard, { replace: true });
    } catch (e) {
      setAuthError('Email o contraseña incorrectos. ' + getErrorMessage(e));
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-brand-dark px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-strong animate-slide-up">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand text-cream">
            <Coffee size={26} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Panel Entre Amigos</h1>
          <p className="text-sm text-ink-soft">Ingresá con tu cuenta de administrador</p>
        </div>

        {authError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Field label="Email" required error={errors.email?.message}>
            <Input type="email" autoComplete="email" placeholder="admin@correo.com" {...register('email')} />
          </Field>
          <Field label="Contraseña" required error={errors.password?.message}>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
            />
          </Field>
          <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
