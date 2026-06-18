import { useMemo } from 'react';
import { useNavigate, useSearchParams, NavLink } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ControlledFormField } from '@/components/controlled-form-field';

const formSchema = z
  .object({
    name: z.string().min(3, 'Nombre requerido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    repassword: z.string(),
    phone: z
      .string()
      .regex(/^\+569\d{8}$/, 'Debe tener formato +569XXXXXXXX'),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repassword'],
  });

export function AcceptInvitationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      password: '',
      repassword: '',
      phone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const acceptInvitation = async () => {
      if (!token) {
        throw new Error('Token de invitación no encontrado.');
      }

      const res = await fetch(
        `${import.meta.env.VITE_XAPITY_API_URL}/auth/invitations/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            name: values.name,
            password: values.password,
            phone: values.phone,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'No se pudo aceptar la invitación');
      }

      return await res.json();
    };

    await toast.promise(acceptInvitation, {
      loading: 'Creando cuenta...',
      success: () => {
        navigate('/login');

        return {
          message: 'Cuenta creada',
          description: 'Ya puedes iniciar sesión en Xapity.',
        };
      },
      error: (error) => ({
        message: 'Error',
        description: error.message || 'No se pudo aceptar la invitación',
      }),
    });
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-6 px-4 text-center">
        <h1 className="text-2xl font-bold">Invitación inválida</h1>
        <p className="text-muted-foreground">
          No encontramos un token de invitación válido en el enlace.
        </p>
        <Button asChild>
          <NavLink to="/login">Volver al login</NavLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
          <MailCheck className="h-3.5 w-3.5" />
          Invitación Xapity
        </div>

        <h1 className="text-2xl font-bold">Completa tu registro</h1>

        <p className="text-muted-foreground">
          Define tus datos de acceso para activar tu cuenta.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <ControlledFormField
            name="name"
            label="Nombre"
            placeholder="Tu nombre"
            type="text"
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledFormField
              name="password"
              label="Contraseña"
              placeholder="Contraseña"
              type="password"
            />

            <ControlledFormField
              name="repassword"
              label="Repetir"
              placeholder="Repite tu contraseña"
              type="password"
            />
          </div>

          <ControlledFormField
            name="phone"
            label="Teléfono"
            placeholder="+56987487830"
            type="text"
          />

          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin" />
            )}
            Crear cuenta
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        ¿Ya tienes cuenta?{' '}
        <NavLink to="/login" className="underline underline-offset-4">
          Iniciar sesión
        </NavLink>
      </div>
    </div>
  );
}