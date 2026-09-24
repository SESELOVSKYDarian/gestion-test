"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { EstadoError } from "@/components/common/EstadoError";
import { EstadoVacio } from "@/components/common/EstadoVacio";
import { useConsulta } from "@/hooks/useConsulta";
import { llamarApi } from "@/lib/cliente/llamar-api";
import type { ClaveApi } from "@/tipos/panel";
import { PanelNuevaClave } from "./PanelNuevaClave";
import { FilaClave } from "./FilaClave";
import { ConfirmarRevocar } from "./ConfirmarRevocar";

export function VistaClaves() {
  const { datos, error, recargar } = useConsulta<ClaveApi[]>("/api/panel/claves/listar");
  const [aRevocar, setARevocar] = useState<ClaveApi | null>(null);

  async function revocar() {
    if (!aRevocar) return;
    const clave = aRevocar;
    setARevocar(null);
    try {
      await llamarApi("/api/panel/claves/revocar", { id: clave.id });
      toast.success(`Clave "${clave.nombre}" revocada`);
      recargar();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo="Claves de API"
        descripcion="Cada sistema externo se conecta con una clave pública y una privada. La privada se muestra una sola vez."
      >
        <PanelNuevaClave alCrear={recargar} />
      </EncabezadoPagina>

      {error ? <EstadoError mensaje={error} alReintentar={recargar} /> : null}
      {!datos && !error ? <Skeleton className="h-48 w-full" /> : null}
      {datos && datos.length === 0 ? (
        <EstadoVacio titulo="Todavía no hay claves" texto="Creá la primera para que otro sistema pueda consumir la API." />
      ) : null}
      {datos && datos.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {datos.map((clave) => (
            <FilaClave key={clave.id} clave={clave} alRevocar={() => setARevocar(clave)} />
          ))}
        </ul>
      ) : null}

      <ConfirmarRevocar nombre={aRevocar?.nombre ?? null} alCerrar={() => setARevocar(null)} alConfirmar={revocar} />
    </div>
  );
}
