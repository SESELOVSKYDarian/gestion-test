import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatearFecha } from "@/lib/formato";
import type { EventoAuditoria } from "@/tipos/panel";
import { EtiquetaEstado } from "@/components/auditoria/EtiquetaEstado";

export function ActividadReciente({ eventos }: { eventos: EventoAuditoria[] }) {
  return (
    <section aria-labelledby="titulo-actividad" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 id="titulo-actividad" className="text-fluid-lg font-medium">Actividad reciente</h2>
        <Link href="/auditoria" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          Ver todo <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {eventos.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">Todavía no hubo pedidos.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {eventos.map((evento) => (
            <li key={evento.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
              <EtiquetaEstado estado={evento.estado} />
              <span className="font-medium">{evento.accion}</span>
              {evento.tabla ? <span className="font-mono text-xs text-muted-foreground">{evento.tabla}</span> : null}
              <span className="ml-auto text-xs text-muted-foreground">
                {evento.origen} · {formatearFecha(evento.fecha, true)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
