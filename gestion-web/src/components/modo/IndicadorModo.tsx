"use client";

import { cn } from "@/lib/utils";
import { useModo } from "./ContextoModo";

// pastilla chica: verde apagado = lectura, ambar = escritura
export function IndicadorModo({ className }: { className?: string }) {
  const { estado } = useModo();
  const escritura = estado.modo === "escritura";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
        escritura ? "bg-escritura-suave text-escritura" : "bg-lectura-suave text-lectura",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", escritura ? "bg-escritura" : "bg-lectura")} />
      {escritura ? "Lectura y escritura" : "Solo lectura"}
    </span>
  );
}
