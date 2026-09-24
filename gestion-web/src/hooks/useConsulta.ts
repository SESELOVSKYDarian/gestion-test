"use client";

import { useEffect, useState } from "react";
import { llamarApi } from "@/lib/cliente/llamar-api";

type Resultado<T> = { peticion: string; datos: T | null; error: string | null };

// carga datos de una ruta POST y se vuelve a pedir cuando cambia el cuerpo
export function useConsulta<T>(ruta: string, cuerpo: object = {}) {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);
  const peticion = JSON.stringify([ruta, cuerpo, version]);

  useEffect(() => {
    let vigente = true;
    const [rutaActual, cuerpoActual] = JSON.parse(peticion) as [string, object];
    llamarApi<T>(rutaActual, cuerpoActual)
      .then((datos) => vigente && setResultado({ peticion, datos, error: null }))
      .catch((error: Error) => vigente && setResultado({ peticion, datos: null, error: error.message }));
    return () => {
      vigente = false;
    };
  }, [peticion]);

  const cargando = resultado?.peticion !== peticion;
  return {
    // mientras recarga muestro lo ultimo que llego (no parpadea la tabla)
    datos: resultado?.datos ?? null,
    error: cargando ? null : (resultado?.error ?? null),
    cargando,
    recargar: () => setVersion((v) => v + 1),
  };
}
