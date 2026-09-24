"use client";

import { useEffect, useState } from "react";

// devuelve el valor recien cuando el usuario deja de escribir
export function useDemora<T>(valor: T, ms = 300): T {
  const [demorado, setDemorado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setDemorado(valor), ms);
    return () => clearTimeout(temporizador);
  }, [valor, ms]);

  return demorado;
}
