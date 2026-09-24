import { ErrorApi } from "@/lib/http/error-api";
import type { Columna, TablaLegacy } from "@/services/esquema/tipos";
import { validarValor } from "./validar-valor";

type ErrorCampo = { campo: string; mensaje: string };
type Preparado = { columnas: string[]; valores: unknown[] };

function buscarColumna(tabla: TablaLegacy, nombre: string): Columna | undefined {
  return tabla.columnas.find((columna) => columna.nombre === nombre);
}

function faltantesAlCrear(tabla: TablaLegacy, datos: Record<string, unknown>): ErrorCampo[] {
  const errores: ErrorCampo[] = [];
  for (const columna of tabla.columnas) {
    const obligatoria = !columna.aceptaNulo && !columna.tieneDefecto && !columna.autoIncremental;
    if (obligatoria && !(columna.nombre in datos)) {
      errores.push({ campo: columna.nombre, mensaje: "es obligatorio" });
    }
  }
  return errores;
}

// valido cada campo contra el esquema y devuelvo columnas + valores listos para SQL
export function prepararDatos(
  tabla: TablaLegacy,
  datos: Record<string, unknown>,
  operacion: "crear" | "modificar",
): Preparado {
  const errores: ErrorCampo[] = operacion === "crear" ? faltantesAlCrear(tabla, datos) : [];
  const columnas: string[] = [];
  const valores: unknown[] = [];

  for (const [nombre, valor] of Object.entries(datos)) {
    const columna = buscarColumna(tabla, nombre);
    if (!columna) {
      errores.push({ campo: nombre, mensaje: "la columna no existe" });
      continue;
    }
    if (operacion === "modificar" && columna.esClave) {
      errores.push({ campo: nombre, mensaje: "no se puede modificar la clave primaria" });
      continue;
    }
    const resultado = validarValor(columna, valor);
    if (!resultado.ok) {
      errores.push({ campo: nombre, mensaje: resultado.mensaje });
      continue;
    }
    columnas.push(nombre);
    valores.push(resultado.valor);
  }

  if (errores.length > 0) throw new ErrorApi(400, "datos_invalidos", "Hay campos con errores", errores);
  if (columnas.length === 0) throw new ErrorApi(400, "sin_datos", "No se enviaron campos para guardar");
  return { columnas, valores };
}

// el id es un objeto con TODAS las columnas de la clave primaria
export function prepararId(tabla: TablaLegacy, id: Record<string, unknown>): Preparado {
  const columnas: string[] = [];
  const valores: unknown[] = [];
  for (const nombre of tabla.clavePrimaria) {
    const columna = buscarColumna(tabla, nombre);
    const resultado = columna ? validarValor(columna, id[nombre]) : null;
    if (!resultado || !resultado.ok || resultado.valor === null) {
      throw new ErrorApi(400, "id_invalido", `El id debe incluir ${tabla.clavePrimaria.join(", ")}`);
    }
    columnas.push(nombre);
    valores.push(resultado.valor);
  }
  return { columnas, valores };
}
