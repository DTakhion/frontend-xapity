import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ControlledFormField } from '@/components/controlled-form-field';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema2 = z.object({
  companyName: z.string().min(3),
  companyRuc: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
});

// second step of the signup form, where the user can add his first business
export function SignupForm2() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema2>>({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      companyName: '',
      companyRuc: '',
      companyAddress: '',
      companyPhone: '',
    },
  });

  async function onSubmit(_values: z.infer<typeof formSchema2>) {
    try {
      toast.success('Haz creado tu cuenta exitosamente!');
      navigate('/', { replace: true });
    } catch (error) {
      return error;
    }
  }

  return (
    <div className={'flex flex-col gap-7 px-1'}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Agrega tu primer Negocio</h1>
        <p className="text-muted-foreground text-balance">
          Éste es el último paso para crear tu cuenta.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ul className="grid grid-cols-2 gap-6 w-full">
            <li className="col-span-2">
              <ControlledFormField
                name="companyName"
                label="Nombre del negocio"
                placeholder="Nombre del negocio"
                type="text"
              />
            </li>
            <li className="col-span-2">
              <ControlledFormField
                name="companyRuc"
                label="RUC del negocio"
                placeholder="RUC del negocio"
              />
            </li>
            <li className="col-span-1">
              <ControlledFormField
                name="companyAddress"
                label="Dirección del negocio"
                placeholder="Dirección del negocio"
              />
            </li>
            <li className="col-span-1">
              <ControlledFormField
                name="companyPhone"
                label="Teléfono del negocio"
                placeholder="Teléfono del negocio"
              />
            </li>
          </ul>
          <Button disabled={form.formState.isSubmitting} type="submit" className="mt-10 w-full">
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin" />
            )}
            Agregar Negocio
          </Button>
        </form>
      </Form>
    </div>
  );
}
