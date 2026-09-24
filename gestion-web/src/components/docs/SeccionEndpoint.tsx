import type { Endpoint } from "./endpoints";
import { BloqueCodigo } from "./BloqueCodigo";

export function SeccionEndpoint({ endpoint }: { endpoint: Endpoint }) {
  return (
    <article className="grid gap-4 py-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">POST</span>
          <code className="font-mono text-sm break-all">{endpoint.ruta}</code>
        </p>
        <p className="text-sm text-muted-foreground">{endpoint.descripcion}</p>
        {endpoint.escribe ? (
          <p className="text-xs text-escritura">Necesita modo escritura, clave de escritura y tabla habilitada.</p>
        ) : null}
      </div>
      <div className="grid min-w-0 gap-3">
        <BloqueCodigo etiqueta="Cuerpo" codigo={JSON.stringify(endpoint.cuerpo, null, 2)} />
        <BloqueCodigo etiqueta="Respuesta" codigo={JSON.stringify(endpoint.respuesta, null, 2)} />
      </div>
    </article>
  );
}
