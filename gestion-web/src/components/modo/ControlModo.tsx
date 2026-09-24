"use client";

import { useState } from "react";
import { toast } from "sonner";
import { llamarApi } from "@/lib/cliente/llamar-api";
import { formatearFecha } from "@/lib/formato";
import type { EstadoModo, ModoApi } from "@/tipos/panel";
import { useModo } from "./ContextoModo";
import { OpcionModo } from "./OpcionModo";
import { ConfirmarEscritura } from "./ConfirmarEscritura";

export function ControlModo({ alCambiar }: { alCambiar?: () => void }) {
  const { estado, actualizar } = useModo();
  const [guardando, setGuardando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  async function guardar(modo: ModoApi) {
    setGuardando(true);
    try {
      const nuevo = await llamarApi<EstadoModo>("/api/panel/modo/cambiar", { modo });
      actualizar(nuevo);
      toast.success(modo === "escritura" ? "Escritura habilitada" : "La API volvió a solo lectura");
      alCambiar?.();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  function elegir(modo: ModoApi) {
    if (modo === estado.modo) return;
    // pasar a lectura es seguro; a escritura, pido confirmacion
    if (modo === "escritura") setConfirmando(true);
    else guardar("lectura");
  }

  return (
    <section aria-labelledby="titulo-modo" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-modo" className="text-fluid-lg font-medium">Modo de la API</h2>
        {estado.actualizadoPor ? (
          <p className="text-xs text-muted-foreground">
            Último cambio: {estado.actualizadoPor}, {formatearFecha(estado.actualizadoEn, true)}
          </p>
        ) : null}
      </div>
      <div role="radiogroup" aria-labelledby="titulo-modo" className="flex flex-col gap-2 sm:flex-row">
        <OpcionModo
          titulo="Solo lectura"
          texto="Las claves pueden listar y buscar. Nadie escribe en la base."
          tono="lectura"
          activa={estado.modo === "lectura"}
          deshabilitada={guardando}
          alElegir={() => elegir("lectura")}
        />
        <OpcionModo
          titulo="Lectura y escritura"
          texto="Las claves de escritura pueden crear, modificar y borrar en tablas habilitadas."
          tono="escritura"
          activa={estado.modo === "escritura"}
          deshabilitada={guardando}
          alElegir={() => elegir("escritura")}
        />
      </div>
      <ConfirmarEscritura
        abierto={confirmando}
        alCerrar={() => setConfirmando(false)}
        alConfirmar={() => {
          setConfirmando(false);
          guardar("escritura");
        }}
      />
    </section>
  );
}
