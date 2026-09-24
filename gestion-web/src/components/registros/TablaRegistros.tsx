import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Orden } from "@/hooks/useRegistros";
import { cn } from "@/lib/utils";
import type { Columna, Fila } from "@/tipos/panel";
import { CabeceraColumna } from "./CabeceraColumna";
import { CeldaValor } from "./CeldaValor";
import { AccionesFila } from "./AccionesFila";

type Props = {
  columnas: Columna[];
  clavePrimaria: string[];
  filas: Fila[];
  orden: Orden;
  editable: boolean;
  cargando: boolean;
  alOrdenar: (columna: string) => void;
  alEditar: (fila: Fila) => void;
  alEliminar: (fila: Fila) => void;
};

function claveDeFila(clavePrimaria: string[], fila: Fila, indice: number) {
  if (clavePrimaria.length === 0) return String(indice);
  return clavePrimaria.map((c) => fila[c]).join("·");
}

// la tabla scrollea de costado en pantallas chicas; la columna de acciones queda fija
export function TablaRegistros(props: Props) {
  const { columnas, clavePrimaria, filas, orden, editable, cargando } = props;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border transition-opacity duration-150", cargando && "opacity-60")}>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            {columnas.map((columna) => (
              <CabeceraColumna key={columna.nombre} columna={columna} orden={orden} alOrdenar={() => props.alOrdenar(columna.nombre)} />
            ))}
            {editable ? <TableHead className="sticky right-0 w-20 bg-card"><span className="sr-only">Acciones</span></TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filas.map((fila, indice) => {
            const clave = claveDeFila(clavePrimaria, fila, indice);
            return (
              <TableRow key={clave}>
                {columnas.map((columna) => (
                  <TableCell key={columna.nombre} className="max-w-72 truncate px-3 text-sm">
                    <CeldaValor columna={columna} valor={fila[columna.nombre]} />
                  </TableCell>
                ))}
                {editable ? (
                  <TableCell className="sticky right-0 bg-card px-2">
                    <AccionesFila etiqueta={clave} alEditar={() => props.alEditar(fila)} alEliminar={() => props.alEliminar(fila)} />
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
