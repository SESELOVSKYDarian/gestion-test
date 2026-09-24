import { cn } from "@/lib/utils";

type Conexion = { nombre: string; ok: boolean; ms: number | null; mensaje: string };

export function Conexiones({ conexiones }: { conexiones: Conexion[] }) {
  return (
    <section aria-labelledby="titulo-conexiones" className="flex flex-col gap-3">
      <h2 id="titulo-conexiones" className="text-fluid-lg font-medium">Conexiones</h2>
      <ul className="divide-y divide-border border-y border-border">
        {conexiones.map((conexion) => (
          <li key={conexion.nombre} className="flex items-start gap-3 py-3">
            <span
              aria-hidden
              className={cn("mt-1.5 size-2 shrink-0 rounded-full", conexion.ok ? "bg-exito" : "bg-destructive")}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm">{conexion.nombre}</p>
              <p className={cn("text-xs break-words", conexion.ok ? "text-muted-foreground" : "text-destructive")}>
                {conexion.ok ? `${conexion.mensaje} · ${conexion.ms} ms` : conexion.mensaje}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
