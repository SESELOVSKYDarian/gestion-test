"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { EstadoError } from "@/components/common/EstadoError";
import { EstadoVacio } from "@/components/common/EstadoVacio";
import { useTablas } from "@/hooks/useTablas";
import { FiltrosTablas } from "./FiltrosTablas";
import { CabeceraListaTablas } from "./CabeceraListaTablas";
import { FilaTabla } from "./FilaTabla";

export function VistaTablas() {
  const { tablas, datos, cargando, error, guardando, configurar, recargarEsquema, recargar } = useTablas();
  const [texto, setTexto] = useState("");
  const [soloExpuestas, setSoloExpuestas] = useState(false);

  const busqueda = texto.trim().toLowerCase();
  const visibles = tablas.filter((tabla) => {
    if (soloExpuestas && !tabla.expuesta) return false;
    return tabla.nombre.toLowerCase().includes(busqueda);
  });

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina
        titulo="Tablas"
        descripcion="Elegí qué tablas del sistema viejo ve la API y en cuáles se puede escribir. Lo que no está expuesto no existe para las claves."
      >
        <Button variant="outline" onClick={recargarEsquema} disabled={cargando}>
          <RefreshCw className={cargando ? "animate-spin" : undefined} />
          Releer estructura
        </Button>
      </EncabezadoPagina>

      <FiltrosTablas texto={texto} soloExpuestas={soloExpuestas} alCambiarTexto={setTexto} alCambiarSoloExpuestas={setSoloExpuestas} />

      {error ? <EstadoError mensaje={error} alReintentar={recargar} /> : null}
      {!datos && !error ? <Skeleton className="h-72 w-full" /> : null}

      {datos && visibles.length === 0 ? (
        <EstadoVacio titulo="No hay tablas para mostrar" texto="Probá con otra búsqueda o desactivá el filtro de expuestas." />
      ) : null}

      {visibles.length > 0 ? (
        <div>
          <CabeceraListaTablas />
          <ul className="divide-y divide-border">
            {visibles.map((tabla) => (
              <FilaTabla
                key={tabla.nombre}
                tabla={tabla}
                guardando={guardando === tabla.nombre}
                alCambiar={(cambio) => configurar(tabla.nombre, cambio)}
              />
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {visibles.length} de {tablas.length} tablas. Las filas son aproximadas (dato de MariaDB).
          </p>
        </div>
      ) : null}
    </div>
  );
}
