"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatearNumero } from "@/lib/formato";

type Props = {
  pagina: number;
  porPagina: number;
  total: number;
  opciones?: number[];
  alCambiarPagina: (pagina: number) => void;
  alCambiarPorPagina?: (valor: number) => void;
};

export function Paginacion({ pagina, porPagina, total, opciones = [10, 25, 50, 100], alCambiarPagina, alCambiarPorPagina }: Props) {
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const desde = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const hasta = Math.min(pagina * porPagina, total);

  return (
    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="tabular text-muted-foreground">
        {formatearNumero(desde)}–{formatearNumero(hasta)} de {formatearNumero(total)}
      </p>
      <div className="flex items-center gap-3">
        {alCambiarPorPagina ? (
          <label className="flex items-center gap-2 text-muted-foreground">
            Por página
            <select
              value={porPagina}
              onChange={(e) => alCambiarPorPagina(Number(e.target.value))}
              className="h-9 rounded-lg border border-input bg-transparent px-2 text-foreground dark:bg-input/30"
            >
              {opciones.map((opcion) => (
                <option key={opcion} value={opcion}>{opcion}</option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" aria-label="Página anterior" disabled={pagina <= 1} onClick={() => alCambiarPagina(pagina - 1)}>
            <ChevronLeft />
          </Button>
          <span className="tabular min-w-16 text-center text-muted-foreground">{pagina} / {paginas}</span>
          <Button variant="outline" size="icon" aria-label="Página siguiente" disabled={pagina >= paginas} onClick={() => alCambiarPagina(pagina + 1)}>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
