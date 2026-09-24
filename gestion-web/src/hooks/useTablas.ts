"use client";

import { useState } from "react";
import { toast } from "sonner";
import { llamarApi } from "@/lib/cliente/llamar-api";
import type { TablaResumen } from "@/tipos/panel";
import { useConsulta } from "./useConsulta";

type Cambio = { expuesta: boolean; permiteEscritura: boolean };

// lista de tablas + cambios de exposicion con actualizacion inmediata en pantalla
export function useTablas() {
  const [refrescar, setRefrescar] = useState(false);
  const consulta = useConsulta<TablaResumen[]>("/api/panel/tablas/listar", { refrescar });
  const [cambios, setCambios] = useState<Record<string, Cambio>>({});
  const [guardando, setGuardando] = useState<string | null>(null);

  // aplico los cambios locales encima de lo que vino del servidor
  const tablas = (consulta.datos || []).map((tabla) => ({ ...tabla, ...cambios[tabla.nombre] }));

  async function configurar(nombre: string, cambio: Cambio) {
    const anterior = cambios[nombre];
    setCambios((actual) => ({ ...actual, [nombre]: cambio }));
    setGuardando(nombre);
    try {
      await llamarApi("/api/panel/tablas/configurar", { tabla: nombre, ...cambio });
      toast.success(cambio.expuesta ? `${nombre}: ${cambio.permiteEscritura ? "lectura y escritura" : "expuesta"}` : `${nombre} ya no está expuesta`);
    } catch (error) {
      setCambios((actual) => ({ ...actual, [nombre]: anterior }));
      toast.error((error as Error).message);
    } finally {
      setGuardando(null);
    }
  }

  function recargarEsquema() {
    setCambios({});
    if (refrescar) consulta.recargar();
    else setRefrescar(true);
  }

  return { ...consulta, tablas, guardando, configurar, recargarEsquema };
}
