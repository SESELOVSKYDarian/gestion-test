import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { mensaje: string; alReintentar?: () => void };

export function EstadoError({ mensaje, alReintentar }: Props) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4 sm:flex-row sm:items-center">
      <TriangleAlert className="size-4 shrink-0 text-destructive" />
      <p className="flex-1 text-sm">{mensaje}</p>
      {alReintentar ? (
        <Button variant="outline" size="sm" onClick={alReintentar}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
