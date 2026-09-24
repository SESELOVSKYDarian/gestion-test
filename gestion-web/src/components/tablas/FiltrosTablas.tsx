"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Props = {
  texto: string;
  soloExpuestas: boolean;
  alCambiarTexto: (texto: string) => void;
  alCambiarSoloExpuestas: (valor: boolean) => void;
};

export function FiltrosTablas({ texto, soloExpuestas, alCambiarTexto, alCambiarSoloExpuestas }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar tabla…"
          aria-label="Buscar tabla"
          maxLength={64}
          value={texto}
          onChange={(e) => alCambiarTexto(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch checked={soloExpuestas} onCheckedChange={alCambiarSoloExpuestas} />
        Ver solo las expuestas
      </label>
    </div>
  );
}
