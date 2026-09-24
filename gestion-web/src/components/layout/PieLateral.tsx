import { IndicadorModo } from "@/components/modo/IndicadorModo";
import { BotonSalir } from "./BotonSalir";
import { BotonTema } from "./BotonTema";

// abajo de la barra lateral: modo actual, usuario, tema y salir
export function PieLateral({ nombre, email }: { nombre: string; email: string }) {
  return (
    <div className="flex flex-col gap-4 border-t border-sidebar-border pt-4">
      <div className="px-1">
        <p className="mb-1.5 text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground">Modo de la API</p>
        <IndicadorModo />
      </div>
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1 px-1">
          <p className="truncate text-sm font-medium">{nombre}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
        <BotonTema />
        <BotonSalir />
      </div>
    </div>
  );
}
