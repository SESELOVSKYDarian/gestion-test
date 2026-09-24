import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = { texto: string; editable: boolean; alBuscar: (texto: string) => void; alCrear: () => void };

export function BarraRegistros({ texto, editable, alBuscar, alCrear }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar en columnas de texto…"
          aria-label="Buscar registros"
          maxLength={100}
          value={texto}
          onChange={(e) => alBuscar(e.target.value)}
          className="h-10 pl-9"
        />
      </div>
      {editable ? (
        <Button size="lg" onClick={alCrear}>
          <Plus />
          Nuevo registro
        </Button>
      ) : null}
    </div>
  );
}
