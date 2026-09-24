"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { formatearNumero } from "@/lib/formato";
import type { TablaResumen } from "@/tipos/panel";

type Props = {
  tabla: TablaResumen;
  guardando: boolean;
  alCambiar: (cambio: { expuesta: boolean; permiteEscritura: boolean }) => void;
};

function motivoSinEscritura(tabla: TablaResumen) {
  if (tabla.esVista) return "Es una vista";
  if (tabla.clavePrimaria.length === 0) return "Sin clave primaria";
  if (!tabla.expuesta) return "Primero exponela";
  return null;
}

// una tabla: en celular se apila, en escritorio es una fila de grilla
export function FilaTabla({ tabla, guardando, alCambiar }: Props) {
  const motivo = motivoSinEscritura(tabla);

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-3.5 md:grid-cols-[minmax(0,1.6fr)_7rem_minmax(0,1.2fr)_6.5rem_8.5rem_2.5rem]">
      <div className="min-w-0">
        <p className="truncate font-mono text-sm">{tabla.nombre}</p>
        <p className="text-xs text-muted-foreground md:hidden">
          {formatearNumero(tabla.filasAprox)} filas · {tabla.clavePrimaria.join(", ") || "sin clave"}
        </p>
      </div>
      <p className="tabular hidden text-right text-sm text-muted-foreground md:block">{formatearNumero(tabla.filasAprox)}</p>
      <p className="hidden truncate font-mono text-xs text-muted-foreground md:block">
        {tabla.esVista ? "vista" : tabla.clavePrimaria.join(", ") || "—"}
      </p>

      <label className="col-start-1 flex items-center gap-2 text-sm md:col-start-auto">
        <Switch
          checked={tabla.expuesta}
          disabled={guardando}
          onCheckedChange={(valor) => alCambiar({ expuesta: valor, permiteEscritura: false })}
          aria-label={`Exponer ${tabla.nombre}`}
        />
        <span className="md:sr-only">Expuesta</span>
      </label>

      <label className="col-start-1 flex items-center gap-2 text-sm md:col-start-auto" title={motivo || undefined}>
        <Switch
          checked={tabla.permiteEscritura}
          disabled={guardando || Boolean(motivo)}
          onCheckedChange={(valor) => alCambiar({ expuesta: true, permiteEscritura: valor })}
          aria-label={`Permitir escritura en ${tabla.nombre}`}
          className="data-checked:bg-escritura"
        />
        <span className="text-xs text-muted-foreground">{motivo || (tabla.permiteEscritura ? "Escritura" : "Solo lectura")}</span>
      </label>

      <Link
        href={`/tablas/${encodeURIComponent(tabla.nombre)}`}
        aria-label={`Ver registros de ${tabla.nombre}`}
        className="col-start-2 row-span-3 row-start-1 flex size-9 items-center justify-center justify-self-end rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:col-start-auto md:row-span-1 md:row-start-auto"
      >
        <ChevronRight className="size-4" />
      </Link>
    </li>
  );
}
