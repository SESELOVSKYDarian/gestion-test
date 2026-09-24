"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Columna, Fila } from "@/tipos/panel";
import { FormularioRegistro } from "./FormularioRegistro";

type Props = {
  abierto: boolean;
  tabla: string;
  columnas: Columna[];
  clavePrimaria: string[];
  fila: Fila | null;
  alCerrar: () => void;
  alGuardar: () => void;
};

// panel lateral: deja ver la tabla detras mientras se edita
export function EditorRegistro({ abierto, tabla, columnas, clavePrimaria, fila, alCerrar, alGuardar }: Props) {
  const clave = fila ? clavePrimaria.map((c) => fila[c]).join(" · ") : "nuevo";

  return (
    <Sheet open={abierto} onOpenChange={(valor) => !valor && alCerrar()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{fila ? "Editar registro" : "Nuevo registro"}</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {tabla} · {clave}
          </SheetDescription>
        </SheetHeader>
        {/* key: al cambiar de fila se reinicia el formulario */}
        {abierto ? (
          <FormularioRegistro
            key={clave}
            tabla={tabla}
            columnas={columnas}
            clavePrimaria={clavePrimaria}
            fila={fila}
            alGuardar={alGuardar}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
