import { EtiquetaEstado } from "@/components/auditoria/EtiquetaEstado";
import { ERRORES } from "./endpoints";

export function SeccionErrores() {
  return (
    <section id="errores" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="text-fluid-lg font-medium">Errores</h2>
      <p className="text-sm text-muted-foreground">
        Formato: <code className="font-mono">{`{ "ok": false, "error": { "codigo", "mensaje", "detalles" } }`}</code>
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {ERRORES.map((error) => (
          <li key={`${error.estado}-${error.codigo}`} className="grid gap-1 py-3 text-sm sm:grid-cols-[3rem_14rem_1fr] sm:items-center sm:gap-4">
            <EtiquetaEstado estado={error.estado} />
            <code className="font-mono text-xs">{error.codigo}</code>
            <span className="text-muted-foreground">{error.texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
