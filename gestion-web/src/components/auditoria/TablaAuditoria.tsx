import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { EventoAuditoria } from "@/tipos/panel";
import { EtiquetaEstado } from "./EtiquetaEstado";

export function TablaAuditoria({ eventos, cargando }: { eventos: EventoAuditoria[]; cargando: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border transition-opacity", cargando && "opacity-60")}>
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-3">Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Tabla</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead className="px-3">IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell className="tabular px-3 whitespace-nowrap text-muted-foreground">{formatearFecha(evento.fecha, true)}</TableCell>
              <TableCell><EtiquetaEstado estado={evento.estado} /></TableCell>
              <TableCell className="font-medium">{evento.accion}</TableCell>
              <TableCell className="font-mono text-xs">{evento.tabla || "—"}</TableCell>
              <TableCell className="whitespace-nowrap">{evento.origen}</TableCell>
              <TableCell className="max-w-80 truncate text-muted-foreground" title={evento.detalle || undefined}>{evento.detalle || "—"}</TableCell>
              <TableCell className="px-3 font-mono text-xs text-muted-foreground">{evento.ip || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
