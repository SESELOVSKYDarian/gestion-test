"use client";

import { Input } from "@/components/ui/input";

const ACCIONES = ["tablas", "esquema", "listar", "buscar", "crear", "modificar", "eliminar", "modo", "login"];

type Props = {
  accion: string;
  tabla: string;
  alCambiarAccion: (valor: string) => void;
  alCambiarTabla: (valor: string) => void;
};

export function FiltrosAuditoria({ accion, tabla, alCambiarAccion, alCambiarTabla }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <select
        aria-label="Filtrar por acción"
        value={accion}
        onChange={(e) => alCambiarAccion(e.target.value)}
        className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm sm:w-48 dark:bg-input/30"
      >
        <option value="">Todas las acciones</option>
        {ACCIONES.map((valor) => (
          <option key={valor} value={valor}>{valor}</option>
        ))}
      </select>
      <Input
        type="search"
        aria-label="Filtrar por tabla"
        placeholder="Filtrar por tabla…"
        maxLength={64}
        value={tabla}
        onChange={(e) => alCambiarTabla(e.target.value)}
        className="h-10 sm:max-w-xs"
      />
    </div>
  );
}
