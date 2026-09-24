import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { etiqueta: string; alEditar: () => void; alEliminar: () => void };

export function AccionesFila({ etiqueta, alEditar, alEliminar }: Props) {
  return (
    <div className="flex justify-end gap-0.5">
      <Button variant="ghost" size="icon-sm" aria-label={`Editar ${etiqueta}`} onClick={alEditar}>
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Eliminar ${etiqueta}`}
        onClick={alEliminar}
        className="hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
