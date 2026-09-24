import Link from "next/link";
import { Lock } from "lucide-react";

// explico por que no se puede editar y donde se cambia
export function AvisoSoloLectura({ motivo }: { motivo: string }) {
  return (
    <p className="flex items-start gap-2.5 rounded-lg bg-lectura-suave px-4 py-3 text-sm">
      <Lock className="mt-0.5 size-4 shrink-0 text-lectura" />
      <span>
        {motivo}{" "}
        <Link href="/" className="underline underline-offset-4 hover:text-foreground">Cambiar el modo</Link>
        {" · "}
        <Link href="/tablas" className="underline underline-offset-4 hover:text-foreground">Configurar tablas</Link>
      </span>
    </p>
  );
}
