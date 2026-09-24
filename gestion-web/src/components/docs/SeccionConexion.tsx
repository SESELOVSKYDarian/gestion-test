// como se conecta la API con el sistema viejo (resumen; el detalle esta en directorio.md)
export function SeccionConexion() {
  return (
    <section id="conexion" className="flex scroll-mt-20 flex-col gap-4">
      <h2 className="text-fluid-lg font-medium">Conexión con el sistema de gestión</h2>
      <div className="grid gap-6 text-sm md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">MariaDB: conexión directa</h3>
          <p className="text-muted-foreground">
            La API lee y escribe directo en la base. El sistema viejo no se modifica ni instala nada. Hace falta que el
            servidor de Easypanel llegue al puerto 3306 por VPN (Tailscale o WireGuard) y dos usuarios de MariaDB:{" "}
            <code className="font-mono">gw_lectura</code> (solo SELECT) y <code className="font-mono">gw_escritura</code>.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">Access: tablas vinculadas</h3>
          <p className="text-muted-foreground">
            Access es un archivo, no un servidor: no se puede consultar desde Linux. Las tablas se pasan a MariaDB y el
            Access las sigue usando como tablas vinculadas por ODBC. El programa viejo funciona igual y la API ve todo.
          </p>
        </div>
      </div>
    </section>
  );
}
