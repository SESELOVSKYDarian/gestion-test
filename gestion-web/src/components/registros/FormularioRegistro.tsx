"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { EstadoError } from "@/components/common/EstadoError";
import { useFormularioRegistro } from "@/hooks/useFormularioRegistro";
import type { Columna, Fila } from "@/tipos/panel";
import { CampoRegistro } from "./CampoRegistro";

type Props = {
  tabla: string;
  columnas: Columna[];
  clavePrimaria: string[];
  fila: Fila | null;
  alGuardar: () => void;
};

export function FormularioRegistro({ tabla, columnas, clavePrimaria, fila, alGuardar }: Props) {
  const formulario = useFormularioRegistro({ tabla, columnas, clavePrimaria, fila });

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (await formulario.enviar()) alGuardar();
  }

  return (
    <form onSubmit={enviar} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
        {formulario.errorGeneral ? <EstadoError mensaje={formulario.errorGeneral} /> : null}
        {columnas.map((columna) => (
          <CampoRegistro
            key={columna.nombre}
            columna={columna}
            valor={formulario.valores[columna.nombre]}
            error={formulario.errores[columna.nombre] || undefined}
            soloLectura={!formulario.creando && columna.esClave}
            alCambiar={(valor) => formulario.cambiar(columna.nombre, valor)}
          />
        ))}
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <SheetClose asChild>
          <Button type="button" variant="ghost">Cancelar</Button>
        </SheetClose>
        <Button type="submit" disabled={formulario.enviando}>
          {formulario.enviando ? <Loader2 className="animate-spin" /> : null}
          {formulario.creando ? "Crear registro" : "Guardar cambios"}
        </Button>
      </SheetFooter>
    </form>
  );
}
