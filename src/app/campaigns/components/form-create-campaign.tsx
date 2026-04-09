// app/campaigns/components/from-create-campaign.tsx
import * as React from 'react';
import { BaseDialog } from '@/components/base-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormLabel } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ControlledFormField } from '@/components/controlled-form-field';

const formSchema = z.object({
  name: z.string().min(2, 'Requerido').max(80),
  initialDate: z.string().min(1, 'Requerido'), // <input type="date"> -> "YYYY-MM-DD"
  finalDate: z.string().min(1, 'Requerido'),
  sucursales: z.string().min(1, 'Requerido'),  // CSV, texto o JSON como string
  segmento_clientes: z.string().optional(),    // opcional
});

type FormValues = z.infer<typeof formSchema>;

export const FormCreateCampaign = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      initialDate: '',
      finalDate: '',
      sucursales: '',
      segmento_clientes: '',
    },
  });

  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  // Resuelve base URL: usa VITE_API_BASE_URL o /api en dev
  const PREFIX = React.useMemo(() => {
    const raw = (import.meta as any)?.env?.VITE_API_BASE_URL ?? '';
    const base = String(raw).trim().replace(/^['"]|['"]$/g, '').replace(/\s+/g, '').replace(/\/+$/, '');
    return base || (import.meta.env.MODE === 'development' ? '/api' : '');
  }, []);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setErrorMsg(null);
    setOkMsg(null);

    try {
      if (!file) {
        setErrorMsg('Adjunta el Excel de productos (.xlsx)');
        setSubmitting(false);
        return;
      }

      const fd = new FormData();
      // nombres EXACTOS del endpoint
      fd.set('nombre', values.name);
      fd.set('fecha_inicio', values.initialDate);
      fd.set('fecha_termino', values.finalDate);
      fd.set('archivo_productos', file);
      fd.set('sucursales', values.sucursales);
      if (values.segmento_clientes && values.segmento_clientes.trim()) {
        fd.set('segmento_clientes', values.segmento_clientes.trim());
      }

      const url = `${PREFIX}/campanas`;
      const res = await fetch(url, { method: 'POST', body: fd }); 
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`POST ${url} → ${res.status} ${res.statusText}\n${text}`);
      }
      const json = await res.json();
      setOkMsg(`Campaña creada ✅ ID: ${json?.campana_id ?? '(sin id)'}`);

      // limpiar
      form.reset();
      setFile(null);
    } catch (err: any) {
      setErrorMsg(String(err?.message ?? err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BaseDialog
      width={600}
      title="Crear Campaña"
      description="Completa los datos y sube el Excel de productos."
      renderToggleButton={() => (
        <Button variant="default" size="sm">Crear Campaña</Button>
      )}
      renderContent={() => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[400px] flex flex-col gap-6 mt-4 w-full">
            <ControlledFormField
              name="name"
              label="Nombre de la Campaña"
              placeholder="Nombre de la Campaña"
              type="text"
            />

            <ControlledFormField
              name="initialDate"
              label="Fecha de inicio"
              placeholder="Fecha de inicio"
              type="date"
            />
            <ControlledFormField
              name="finalDate"
              label="Fecha de término"
              placeholder="Fecha de término"
              type="date"
            />

            {/* Archivo: mejor como input controlado aparte para asegurar File */}
            <div className="grid gap-1">
              <FormLabel>Sube tus productos (.xlsx)</FormLabel>
              <input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="border rounded px-2 py-2"
                required
              />
            </div>

            {/* Sucursales (texto/CSV/JSON como string) */}
            <ControlledFormField
              name="sucursales"
              label="Agrega Sucursales"
              placeholder='ej: "centro sur" o S1,S2 o ["S1","S2"]'
              type="text"
            />
            <p className="text-xs text-muted-foreground -mt-2">
              Puedes escribir una sucursal, una lista separada por comas o un JSON de arreglo.
            </p>

            {/* Segmento de clientes (textarea manual, registrado en RHF) */}
            <div className="grid gap-1">
              <FormLabel>Caracteriza tus clientes objetivos (opcional)</FormLabel>
              <textarea
                {...form.register('segmento_clientes')}
                name="segmento_clientes"
                placeholder='ej: {"genero":"femenino","edad":"25-34","mascotas":"sí","preferencia_dieta":"vegana"}'
                className="border rounded px-2 py-2 min-h-[90px]"
              />
              <p className="text-xs text-muted-foreground">
                Acepta JSON o texto simple.
              </p>
            </div>

            {errorMsg ? <pre className="text-xs text-red-600 whitespace-pre-wrap">{errorMsg}</pre> : null}
            {okMsg ? <div className="text-xs text-green-600">{okMsg}</div> : null}

            <Button className="mt-2 self-end" type="submit" disabled={submitting}>
              {submitting ? 'Creando…' : 'Submit'}
            </Button>
          </form>
        </Form>
      )}
    />
  );
};