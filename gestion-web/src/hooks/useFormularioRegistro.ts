"use client";

import { useState } from "react";
import { armarDatos, idDeFila, valoresIniciales, type ValoresFormulario } from "@/lib/registros/formulario";
import { validarCampo } from "@/lib/registros/validar-campo";
import { ErrorCliente, llamarApi } from "@/lib/cliente/llamar-api";
import type { Columna, Fila } from "@/tipos/panel";

type Params = { tabla: string; columnas: Columna[]; clavePrimaria: string[]; fila: Fila | null };

// estado y envio del formulario de alta / edicion
export function useFormularioRegistro({ tabla, columnas, clavePrimaria, fila }: Params) {
  const creando = fila === null;
  const [originales] = useState<ValoresFormulario>(() => valoresIniciales(columnas, fila));
  const [valores, setValores] = useState<ValoresFormulario>(originales);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(nombre: string, valor: string) {
    setValores((actual) => ({ ...actual, [nombre]: valor }));
    // valido en vivo solo el campo que se toco
    const columna = columnas.find((c) => c.nombre === nombre);
    const error = columna ? validarCampo(columna, valor, creando) : null;
    setErrores((actual) => ({ ...actual, [nombre]: error || "" }));
  }

  function validarTodo() {
    const encontrados: Record<string, string> = {};
    for (const columna of columnas) {
      if (!creando && columna.esClave) continue;
      const error = validarCampo(columna, valores[columna.nombre], creando);
      if (error) encontrados[columna.nombre] = error;
    }
    setErrores(encontrados);
    return Object.keys(encontrados).length === 0;
  }

  async function enviar(): Promise<boolean> {
    setErrorGeneral("");
    if (!validarTodo()) return false;
    const datos = armarDatos(columnas, valores, creando ? null : originales);
    if (Object.keys(datos).length === 0) {
      setErrorGeneral("No hay cambios para guardar");
      return false;
    }
    setEnviando(true);
    try {
      if (creando) await llamarApi("/api/panel/registros/crear", { tabla, datos });
      else await llamarApi("/api/panel/registros/modificar", { tabla, id: idDeFila(clavePrimaria, fila), datos });
      return true;
    } catch (error) {
      const detalles = error instanceof ErrorCliente ? error.detalles : [];
      setErrores(Object.fromEntries(detalles.map((d) => [d.campo, d.mensaje])));
      setErrorGeneral((error as Error).message);
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return { creando, valores, errores, errorGeneral, enviando, cambiar, enviar };
}
