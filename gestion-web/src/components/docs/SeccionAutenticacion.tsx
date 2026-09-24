import { BloqueCodigo } from "./BloqueCodigo";

export function SeccionAutenticacion({ urlBase }: { urlBase: string }) {
  const ejemplo = [
    `curl -X POST ${urlBase}/api/v1/registros/listar \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -H "x-api-key: gw_pub_…" \\`,
    `  -H "Authorization: Bearer gw_sec_…" \\`,
    `  -d '{"tabla":"clientes","pagina":1,"porPagina":25}'`,
  ].join("\n");

  return (
    <section id="autenticacion" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="text-fluid-lg font-medium">Autenticación</h2>
      <p className="max-w-prose text-sm text-muted-foreground">
        Todos los endpoints son <strong className="font-medium text-foreground">POST</strong> con cuerpo JSON. Cada
        pedido lleva la clave pública en <code className="font-mono">x-api-key</code> y la privada en{" "}
        <code className="font-mono">Authorization: Bearer</code>. Usar siempre HTTPS.
      </p>
      <BloqueCodigo etiqueta="Ejemplo con curl" codigo={ejemplo} />
    </section>
  );
}
