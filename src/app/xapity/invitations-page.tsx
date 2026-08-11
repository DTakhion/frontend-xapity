import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, UserPlus } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ControlledFormField } from '@/components/controlled-form-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email('Correo inválido'),
  role: z.enum(['admin', 'staff', 'customer', 'user']),
});

export default function InvitationsPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'staff',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const inviteUser = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        throw new Error('Sesión expirada. Vuelve a iniciar sesión.');
      }

      const res = await fetch(
        `${import.meta.env.VITE_XAPITY_API_URL}/auth/invitations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email: values.email,
            role: values.role,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || 'No se pudo crear la invitación');
      }

      return await res.json();
    };

    await toast.promise(inviteUser, {
      loading: 'Enviando invitación...',
      success: (data) => {
        form.reset({
          email: '',
          role: 'staff',
        });

        return {
          message: 'Invitación enviada',
          description: `Se envió una invitación a ${data.email}`,
        };
      },
      error: (error) => ({
        message: 'Error al invitar',
        description: error.message || 'No se pudo enviar la invitación',
      }),
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invitaciones</h1>
        <p className="text-muted-foreground">
          Invita usuarios a tu organización y asigna su perfil de acceso.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <CardTitle>Nueva invitación</CardTitle>
          </div>
          <CardDescription>
            El usuario recibirá un correo para completar su registro.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <ControlledFormField
                name="email"
                label="Correo"
                placeholder="usuario@empresa.cl"
                type="email"
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rol</label>

                <select
                  {...form.register('role')}
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="staff">Colaborador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" />
                )}
                Enviar invitación
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}