import { Button } from "@/components/ui/button";
import { BotonCopiar } from "@/components/common/BotonCopiar";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { ClaveApi } from "@/tipos/panel";

export function FilaClave({ clave, alRevocar }: { clave: ClaveApi; alRevocar: () => void }) {
  const revocada = clave.revocadaEn !== null;

  return (
    <li className={cn("grid gap-x-6 gap-y-2 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_9rem_auto] md:items-center", revocada && "opacity-55")}>
      <div className="min-w-0">
        <p className="truncate font-medium">{clave.nombre}</p>
        <p className="text-xs text-muted-foreground">
          Creada {formatearFecha(clave.creadaEn)}{clave.creador ? ` por ${clave.creador}` : ""}
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-1">
        <code className="truncate font-mono text-xs text-muted-foreground">{clave.clavePublica}</code>
        <BotonCopiar texto={clave.clavePublica} etiqueta="clave pública" />
      </div>
      <div className="text-xs">
        <p className={clave.permiso === "escritura" ? "text-escritura" : "text-lectura"}>
          {clave.permiso === "escritura" ? "Lectura y escritura" : "Solo lectura"}
        </p>
        <p className="text-muted-foreground">
          {revocada ? `Revocada ${formatearFecha(clave.revocadaEn)}` : `Último uso: ${formatearFecha(clave.ultimoUsoEn, true)}`}
        </p>
      </div>
      <div className="md:justify-self-end">
        {revocada ? null : (
          <Button variant="outline" size="sm" onClick={alRevocar} className="hover:border-destructive/40 hover:text-destructive">
            Revocar
          </Button>
        )}
      </div>
    </li>
  );
}
