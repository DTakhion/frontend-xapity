import { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ControlledFormField } from '@/components/controlled-form-field';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { Loader2, MailCheck } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z
  .object({
    name: z.string().min(3, 'Nombre requerido'),
    email: z.string().email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    repassword: z.string(),
    phone: z.string().min(6, 'Teléfono requerido'),
    organizationName: z.string().min(3, 'Nombre requerido'),
    role: z.enum(['admin', 'staff', 'customer']),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repassword'],
  });

const verificationSchema = z.object({
  code: z.string().min(6, 'Ingresa el código de 6 dígitos'),
});

export function SignupForm1() {
  const navigate = useNavigate();

  const [verificationStarted, setVerificationStarted] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repassword: '',
      phone: '',
      organizationName: '',
      role: 'admin',
    },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const startRegistration = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_XAPITY_API_URL}/auth/register/start`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone,
              organizationName: values.organizationName,
              role: values.role,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.detail || 'No se pudo iniciar el registro');
        }

        return await res.json();
      };

      await toast.promise(startRegistration, {
        loading: 'Enviando código...',
        success: () => {
          setPendingEmail(values.email);
          setVerificationStarted(true);

          return {
            message: 'Código enviado',
            description: 'Revisa tu correo para verificar tu cuenta.',
          };
        },
        error: (error) => ({
          message: 'Error',
          description: error.message || 'No se pudo enviar el código',
        }),
      });
    } catch {
      return null;
    }
  }

  async function onVerify(values: z.infer<typeof verificationSchema>) {
    try {
      const verifyRegistration = async () => {
        const res = await fetch(
          `${import.meta.env.VITE_XAPITY_API_URL}/auth/register/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: pendingEmail,
              code: values.code,
            }),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.detail || 'Código inválido');
        }

        return await res.json();
      };

      await toast.promise(verifyRegistration, {
        loading: 'Verificando cuenta...',
        success: () => {
          navigate('/login');

          return {
            message: 'Cuenta verificada',
            description: 'Ya puedes iniciar sesión en Xapity.',
          };
        },
        error: (error) => ({
          message: 'Error de verificación',
          description: error.message || 'Código inválido o expirado',
        }),
      });
    } catch {
      return null;
    }
  }

  if (verificationStarted) {
    return (
      <div className="flex flex-col gap-7 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
            <MailCheck className="h-3.5 w-3.5" />
            Verificación de correo
          </div>

          <h1 className="text-2xl font-bold">Revisa tu correo</h1>

          <p className="text-muted-foreground">
            Enviamos un código de verificación a{' '}
            <span className="font-medium text-foreground">{pendingEmail}</span>
          </p>
        </div>

        <Form {...verificationForm}>
          <form
            onSubmit={verificationForm.handleSubmit(onVerify)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Código de verificación</label>

              <input
                {...verificationForm.register('code')}
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="123456"
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />

              {verificationForm.formState.errors.code && (
                <p className="text-sm text-destructive">
                  {verificationForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={verificationForm.formState.isSubmitting}
            >
              {verificationForm.formState.isSubmitting && (
                <Loader2 className="animate-spin" />
              )}
              Verificar cuenta
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              Reenviar código
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm">
          ¿Te equivocaste de correo?{' '}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => {
              setVerificationStarted(false);
              verificationForm.reset();
            }}
          >
            Volver al registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7 px-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Crear cuenta en Xapity</h1>
        <p className="text-muted-foreground">
          Crea tu organización y comienza a usar Xapity
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

          <ControlledFormField
            name="email"
            label="Correo"
            placeholder="correo@empresa.cl"
            type="email"
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
            placeholder="+569..."
            type="text"
          />

          <ControlledFormField
            name="organizationName"
            label="Nombre organización"
            placeholder="Mi empresa"
            type="text"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Rol</label>

            <select
              {...form.register('role')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="admin">Administrador</option>
              <option value="staff">Staff</option>
              <option value="customer">Cliente</option>
            </select>
          </div>

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