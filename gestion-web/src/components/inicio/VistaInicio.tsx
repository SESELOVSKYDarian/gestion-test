"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { EstadoError } from "@/components/common/EstadoError";
import { ControlModo } from "@/components/modo/ControlModo";
import { useConsulta } from "@/hooks/useConsulta";
import type { EventoAuditoria } from "@/tipos/panel";
import { Cifras } from "./Cifras";
import { Conexiones } from "./Conexiones";
import { ActividadReciente } from "./ActividadReciente";

type Estado = {
  conexiones: { nombre: string; ok: boolean; ms: number | null; mensaje: string }[];
  tablasTotales: number | null;
  tablasExpuestas: number;
  clavesActivas: number;
  pedidosHoy: number;
  escriturasHoy: number;
  rechazadosHoy: number;
  actividad: EventoAuditoria[];
};

function armarCifras(estado: Estado) {
  return [
    { etiqueta: "Tablas en la base", valor: estado.tablasTotales },
    { etiqueta: "Tablas expuestas", valor: estado.tablasExpuestas },
    { etiqueta: "Claves activas", valor: estado.clavesActivas },
    { etiqueta: "Pedidos hoy", valor: estado.pedidosHoy },
    { etiqueta: "Escrituras hoy", valor: estado.escriturasHoy },
    { etiqueta: "Rechazados hoy", valor: estado.rechazadosHoy },
  ];
}

export function VistaInicio() {
  const { datos, cargando, error, recargar } = useConsulta<Estado>("/api/panel/estado/obtener");

  return (
    <div className="flex flex-col gap-8">
      <EncabezadoPagina titulo="Inicio" descripcion="Estado de la API y de las conexiones con el sistema de gestión.">
        <Button variant="outline" onClick={recargar} disabled={cargando}>
          <RefreshCw className={cargando ? "animate-spin" : undefined} />
          Actualizar
        </Button>
      </EncabezadoPagina>

      {error ? <EstadoError mensaje={error} alReintentar={recargar} /> : null}
      {datos ? <Cifras cifras={armarCifras(datos)} /> : <Skeleton className="h-[74px] w-full" />}

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-10">
          <ControlModo alCambiar={recargar} />
          {datos ? <ActividadReciente eventos={datos.actividad} /> : <Skeleton className="h-56 w-full" />}
        </div>
        {datos ? <Conexiones conexiones={datos.conexiones} /> : <Skeleton className="h-48 w-full" />}
      </div>
    </div>
  );
}
