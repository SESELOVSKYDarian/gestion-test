"use client";

import { createContext, use, useState } from "react";
import type { EstadoModo } from "@/tipos/panel";

type ValorContexto = { estado: EstadoModo; actualizar: (estado: EstadoModo) => void };

const Contexto = createContext<ValorContexto | null>(null);

// el modo se muestra en varios lugares (barra lateral, inicio, tablas): lo comparto
export function ProveedorModo({ inicial, children }: { inicial: EstadoModo; children: React.ReactNode }) {
  const [estado, setEstado] = useState(inicial);
  return <Contexto value={{ estado, actualizar: setEstado }}>{children}</Contexto>;
}

export function useModo() {
  const valor = use(Contexto);
  if (!valor) throw new Error("useModo va dentro de ProveedorModo");
  return valor;
}
