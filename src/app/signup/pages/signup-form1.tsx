import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ControlledFormField } from '@/components/controlled-form-field';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';


const formSchema = z.object({
  name: z.string().min(3, 'Nombre requerido'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  repassword: z.string(),
  phone: z.string().min(6, 'Teléfono requerido'),
  organizationName: z.string().min(3, 'Nombre requerido'),
  role: z.enum(['admin', 'staff', 'customer']),
}).refine((data) => data.password === data.repassword, {
  message: 'Las contraseñas no coinciden',
  path: ['repassword'],
});

export function SignupForm1() {
  const navigate = useNavigate();

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const registerUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_XAPITY_API_URL}/auth/register`, {
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
        });

        if (!res.ok) {
          throw new Error('Error al crear cuenta');
        }

        return await res.json();
      };

      await toast.promise(registerUser, {
        loading: 'Creando cuenta...',
        success: () => {
          navigate('/login');
          return {
            message: 'Cuenta creada',
            description: 'Ya puedes iniciar sesión en Xapity',
          };
        },
        error: () => ({
          message: 'Error',
          description: 'No se pudo crear la cuenta',
        }),
      });
    } catch {
      return null;
    }
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

          <Button type="submit" className="mt-4 w-full">
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