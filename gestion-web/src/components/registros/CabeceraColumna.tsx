import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import type { Columna } from "@/tipos/panel";
import type { Orden } from "@/hooks/useRegistros";

type Props = { columna: Columna; orden: Orden; alOrdenar: () => void };

function IconoOrden({ activo, direccion }: { activo: boolean; direccion?: "asc" | "desc" }) {
  if (!activo) return <ChevronsUpDown className="size-3 opacity-40" />;
  return direccion === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />;
}

export function CabeceraColumna({ columna, orden, alOrdenar }: Props) {
  const activo = orden?.columna === columna.nombre;
  const ariaSort = activo ? (orden?.direccion === "asc" ? "ascending" : "descending") : "none";

  return (
    <TableHead aria-sort={ariaSort} className="px-3">
      <button
        type="button"
        onClick={alOrdenar}
        className="inline-flex items-center gap-1.5 font-mono text-xs font-normal text-muted-foreground hover:text-foreground"
      >
        {columna.nombre}
        {columna.esClave ? <span className="text-escritura" title="Clave primaria">·pk</span> : null}
        <IconoOrden activo={activo} direccion={orden?.direccion} />
      </button>
    </TableHead>
  );
}
