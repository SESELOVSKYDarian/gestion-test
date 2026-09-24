import type { Metadata } from "next";
import { headers } from "next/headers";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { SeccionAutenticacion } from "@/components/docs/SeccionAutenticacion";
import { SeccionEndpoint } from "@/components/docs/SeccionEndpoint";
import { SeccionErrores } from "@/components/docs/SeccionErrores";
import { SeccionConexion } from "@/components/docs/SeccionConexion";
import { ENDPOINTS } from "@/components/docs/endpoints";

export const metadata: Metadata = { title: "Documentación" };

// la url base sale del pedido: sirve igual en local y en Easypanel
async function urlBase() {
  const cabeceras = await headers();
  const host = cabeceras.get("x-forwarded-host") || cabeceras.get("host") || "localhost:3000";
  const protocolo = cabeceras.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}`;
}

export default async function DocumentacionPage() {
  const base = await urlBase();

  return (
    <div className="flex max-w-5xl flex-col gap-10">
      <EncabezadoPagina titulo="Documentación de la API" descripcion={`URL base: ${base}`} />
      <SeccionAutenticacion urlBase={base} />
      <section id="endpoints" className="flex scroll-mt-20 flex-col">
        <h2 className="text-fluid-lg font-medium">Endpoints</h2>
        <div className="divide-y divide-border">
          {ENDPOINTS.map((endpoint) => (
            <SeccionEndpoint key={endpoint.ruta} endpoint={endpoint} />
          ))}
        </div>
      </section>
      <SeccionErrores />
      <SeccionConexion />
    </div>
  );
}
