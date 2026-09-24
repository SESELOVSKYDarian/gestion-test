"use client";

import { useState } from "react";
import type { Columna, Fila } from "@/tipos/panel";
import { useConsulta } from "./useConsulta";
import { useDemora } from "./useDemora";

export type Orden = { columna: string; direccion: "asc" | "desc" } | null;

type Listado = { columnas: Columna[]; clavePrimaria: string[]; filas: Fila[]; total: number };

// estado del explorador: pagina, busqueda y orden
export function useRegistros(tabla: string) {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(25);
  const [texto, setTexto] = useState("");
  const [orden, setOrden] = useState<Orden>(null);
  const textoDemorado = useDemora(texto.trim());

  const cuerpo = { tabla, pagina, porPagina, ...(textoDemorado ? { texto: textoDemorado } : {}), ...(orden ? { orden } : {}) };
  const consulta = useConsulta<Listado>("/api/panel/registros/listar", cuerpo);

  function buscar(valor: string) {
    setTexto(valor);
    setPagina(1);
  }

  function ordenarPor(columna: string) {
    // asc → desc → sin orden
    if (!orden || orden.columna !== columna) setOrden({ columna, direccion: "asc" });
    else if (orden.direccion === "asc") setOrden({ columna, direccion: "desc" });
    else setOrden(null);
    setPagina(1);
  }

  function cambiarPorPagina(valor: number) {
    setPorPagina(valor);
    setPagina(1);
  }

  return { ...consulta, pagina, porPagina, texto, orden, setPagina, buscar, ordenarPor, cambiarPorPagina };
}
