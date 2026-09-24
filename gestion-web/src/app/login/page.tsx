import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/sesion";
import { FormularioLogin } from "@/components/auth/FormularioLogin";
import { BotonTema } from "@/components/layout/BotonTema";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage() {
  if (await obtenerSesion()) redirect("/");

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between border-r border-border bg-sidebar p-12 lg:flex">
        <p className="font-heading text-lg font-semibold tracking-tight">
          Gestión <span className="text-muted-foreground">Web</span>
        </p>
        <div className="max-w-md">
          <p className="font-heading text-fluid-xl font-medium leading-tight">
            La base del sistema viejo, disponible como API. Sin tocar el programa que ya funciona.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Elegís qué tablas se ven, quién puede escribir y cuándo. Todo queda registrado.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">MariaDB · Access vía tablas vinculadas</p>
      </section>

      <section className="flex flex-col px-6 py-6 sm:px-12">
        <div className="flex justify-end">
          <BotonTema />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8">
          <div>
            <h1 className="text-fluid-xl font-medium">Ingresar</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Usá tu cuenta de administrador del panel.</p>
          </div>
          <FormularioLogin />
        </div>
      </section>
    </main>
  );
}
