import { formatearFecha } from "@/lib/formato";
import { tipoControl } from "@/lib/registros/tipo-control";
import type { Columna, Fila } from "@/tipos/panel";

// muestro cada valor segun su tipo; fechas en DD/MM/AA
export function CeldaValor({ columna, valor }: { columna: Columna; valor: Fila[string] }) {
  if (valor === null || valor === undefined) {
    return <span className="text-muted-foreground/60 italic">null</span>;
  }
  const control = tipoControl(columna);
  if (control === "fecha") return <span className="tabular">{formatearFecha(String(valor))}</span>;
  if (control === "fechaHora") return <span className="tabular">{formatearFecha(String(valor), true)}</span>;
  if (control === "entero" || control === "decimal") return <span className="tabular">{String(valor)}</span>;
  return <span title={String(valor)}>{String(valor)}</span>;
}
