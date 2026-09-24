import { cn } from "@/lib/utils";

type Props = {
  titulo: string;
  texto: string;
  activa: boolean;
  tono: "lectura" | "escritura";
  deshabilitada: boolean;
  alElegir: () => void;
};

// una de las dos opciones del control de modo (se comporta como radio)
export function OpcionModo({ titulo, texto, activa, tono, deshabilitada, alElegir }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      disabled={deshabilitada}
      onClick={alElegir}
      className={cn(
        "flex flex-1 flex-col items-start gap-1 rounded-lg border px-4 py-3.5 text-left",
        "transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.99]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60",
        activa && tono === "lectura" && "border-lectura/50 bg-lectura-suave",
        activa && tono === "escritura" && "border-escritura/50 bg-escritura-suave",
        !activa && "border-border hover:bg-muted/50",
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <span
          aria-hidden
          className={cn(
            "size-2 rounded-full",
            activa ? (tono === "lectura" ? "bg-lectura" : "bg-escritura") : "bg-muted-foreground/40",
          )}
        />
        {titulo}
      </span>
      <span className="text-xs text-muted-foreground">{texto}</span>
    </button>
  );
}
