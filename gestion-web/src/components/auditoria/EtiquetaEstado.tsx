import { cn } from "@/lib/utils";

// codigo http con color: verde ok, ambar rechazado, rojo error del servidor
export function EtiquetaEstado({ estado }: { estado: number }) {
  return (
    <span
      className={cn(
        "tabular inline-flex rounded px-1.5 py-0.5 font-mono text-[0.7rem]",
        estado < 400 && "bg-exito/10 text-exito",
        estado >= 400 && estado < 500 && "bg-escritura-suave text-escritura",
        estado >= 500 && "bg-destructive/10 text-destructive",
      )}
    >
      {estado}
    </span>
  );
}
