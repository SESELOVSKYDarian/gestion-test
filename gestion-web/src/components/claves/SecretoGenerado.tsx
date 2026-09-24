import { TriangleAlert } from "lucide-react";
import { BotonCopiar } from "@/components/common/BotonCopiar";

type Props = { clavePublica: string; secreto: string };

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs text-muted-foreground">{etiqueta}</p>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 py-1 pr-1 pl-3">
        <code className="min-w-0 flex-1 font-mono text-xs break-all">{valor}</code>
        <BotonCopiar texto={valor} etiqueta={etiqueta} />
      </div>
    </div>
  );
}

// se ve UNA sola vez: despues solo queda el hash en la base
export function SecretoGenerado({ clavePublica, secreto }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <p className="flex items-start gap-2.5 rounded-lg bg-escritura-suave px-3 py-2.5 text-sm">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-escritura" />
        Guardá la clave privada ahora. No se vuelve a mostrar: si se pierde, hay que revocarla y crear otra.
      </p>
      <Dato etiqueta="Clave pública (x-api-key)" valor={clavePublica} />
      <Dato etiqueta="Clave privada (Authorization: Bearer)" valor={secreto} />
    </div>
  );
}
