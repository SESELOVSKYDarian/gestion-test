import { DatabaseZap } from "lucide-react";

// pantalla para cuando la base propia del panel no esta disponible
export function PanelSinBase() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-4 px-6">
      <DatabaseZap className="size-6 text-destructive" />
      <h1 className="text-fluid-lg font-medium">No se pudo conectar con la base del panel</h1>
      <p className="text-sm text-muted-foreground">
        Revisá las variables <code className="font-mono">PANEL_DB_*</code> y que el servicio MariaDB del panel esté
        corriendo en Easypanel. La página se recupera sola cuando la base vuelve.
      </p>
    </main>
  );
}
