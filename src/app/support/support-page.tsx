import { Headphones } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="min-h-[calc(100vh-2rem)] bg-slate-50 px-4 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Headphones className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Soporte
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Solicita ayuda o reporta un problema relacionado con Xapity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}