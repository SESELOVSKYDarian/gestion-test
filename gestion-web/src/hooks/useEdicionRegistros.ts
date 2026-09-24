"use client";

import { useState } from "react";
import { toast } from "sonner";
import { llamarApi } from "@/lib/cliente/llamar-api";
import { idDeFila } from "@/lib/registros/formulario";
import type { Fila } from "@/tipos/panel";

// que fila se edita / borra y el borrado en si
export function useEdicionRegistros(tabla: string, clavePrimaria: string[], alTerminar: () => void) {
  const [editorAbierto, setEditorAbierto] = useState(false);
  const [filaEditada, setFilaEditada] = useState<Fila | null>(null);
  const [filaABorrar, setFilaABorrar] = useState<Fila | null>(null);

  function abrirNuevo() {
    setFilaEditada(null);
    setEditorAbierto(true);
  }

  function abrirEdicion(fila: Fila) {
    setFilaEditada(fila);
    setEditorAbierto(true);
  }

  function guardado() {
    toast.success(filaEditada ? "Registro actualizado" : "Registro creado");
    setEditorAbierto(false);
    alTerminar();
  }

  async function confirmarBorrado() {
    if (!filaABorrar) return;
    const fila = filaABorrar;
    setFilaABorrar(null);
    try {
      await llamarApi("/api/panel/registros/eliminar", { tabla, id: idDeFila(clavePrimaria, fila) });
      toast.success("Registro eliminado");
      alTerminar();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const descripcionBorrado = filaABorrar ? clavePrimaria.map((c) => `${c}=${filaABorrar[c]}`).join(", ") : null;

  return {
    editorAbierto, filaEditada, descripcionBorrado,
    abrirNuevo, abrirEdicion, guardado, confirmarBorrado,
    cerrarEditor: () => setEditorAbierto(false),
    pedirBorrado: setFilaABorrar,
    cancelarBorrado: () => setFilaABorrar(null),
  };
}
