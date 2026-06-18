import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import backgroundImage from '@/assets/images/company_03.png';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ControlledFormField } from '@/components/controlled-form-field';
import { NavLink, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type DivProps = React.ComponentProps<'div'>;

export function LoginForm({ className, ...props }: DivProps) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loginUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_XAPITY_API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        if (!res.ok) {
          throw new Error('Credenciales inválidas');
        }

        const data = await res.json();

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('xapityUser', JSON.stringify(data.user));

        return data;
      };

      await toast.promise(loginUser, {
        loading: 'Ingresando...',
        success: () => {
          navigate('/xapity');
          return {
            message: 'Bienvenido!',
            description: 'Acceso correcto a Xapity',
          };
        },
        error: () => ({
          message: 'Error al ingresar',
          description: 'Correo o contraseña inválidos',
        }),
      });
    } catch {
      return null;
    }
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-5xl flex-col gap-7 px-4 md:px-0',
        className
      )}
      {...props}
    >
      <Card className="overflow-hidden rounded-3xl p-0 shadow-sm">
        <CardContent className="grid p-0 md:grid-cols-2">
          <section className="p-6 md:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Acceso seguro
                </div>

                <h1 className="text-2xl font-bold">Bienvenido a Xapity</h1>

                <p className="text-muted-foreground text-balance">
                  Ingresa con tu cuenta para acceder al ecosistema Xapity.
                </p>
              </div>

              <Button
                disabled
                variant="outline"
                type="button"
                className="h-12 w-full justify-center gap-3 rounded-xl text-sm font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 23 23"
                  className="h-5 w-5"
                >
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span>Continuar con Microsoft</span>
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  O ingresa con correo
                </span>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col gap-5"
                >
                  <ControlledFormField
                    name="email"
                    label="Correo"
                    placeholder="correo@empresa.cl"
                    type="email"
                  />

                  <ControlledFormField
                    name="password"
                    label="Contraseña"
                    placeholder="Contraseña"
                    type="password"
                  />

                  <div className="flex justify-end">
                    <NavLink
                      to="/auth-flow/password-reset"
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      ¿Olvidaste tu contraseña?
                    </NavLink>
                  </div>

                  <Button
                    disabled={form.formState.isSubmitting}
                    className="mt-2 h-12 w-full rounded-xl"
                    type="submit"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2 className="animate-spin" />
                    )}
                    Login
                  </Button>
                </form>
              </Form>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  disabled
                  variant="outline"
                  type="button"
                  className="rounded-xl gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                  >
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4C12.9 4 4 12.9 4 24s8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4C16.3 4 9.6 8.3 6.3 14.7z" />
                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4c-5.3 0-9.8-3.3-11.5-8H6.1C9.3 37.2 16 44 24 44z" />
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.3-6.1 6.8l6.2 5.2C39.2 36.4 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
                  </svg>

                  <span>Continuar con Google</span>
                </Button>

                <Button
                  disabled
                  variant="outline"
                  type="button"
                  className="rounded-xl gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.008 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.683 4.533-4.683c1.313 0 2.686.235 2.686.235v2.96h-1.514c-1.491 0-1.956.93-1.956 1.885v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.081 24 18.092 24 12.073z" />
                  </svg>

                  <span>Continuar con Meta</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                ¿No tienes cuenta todavía?{' '}
                <NavLink
                  to="/auth-flow/signup"
                  className="font-medium underline underline-offset-4"
                >
                  Crear cuenta
                </NavLink>
              </div>
            </div>
          </section>

          <div className="bg-muted relative hidden md:block">
            <img
              src={backgroundImage}
              alt="Equipo de trabajo"
              className="absolute inset-0 h-full w-full object-cover object-right-bottom dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Al continuar, aceptas nuestros <a href="#">Términos de Servicio</a>{' '}
        y <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}