import { ErrorApi } from "@/lib/http/error-api";
import { buscarTabla } from "@/services/esquema/leer-esquema";
import { configDeTabla } from "@/services/esquema/tablas-expuestas";
import type { TablaLegacy } from "@/services/esquema/tipos";
import { obtenerModo } from "@/services/modo/modo";
import type { Actor } from "./actor";

async function tablaExistente(nombre: string): Promise<TablaLegacy> {
  const tabla = await buscarTabla(nombre);
  if (!tabla) throw new ErrorApi(404, "tabla_inexistente", `La tabla ${nombre} no existe`);
  return tabla;
}

// lectura: el panel ve todo; una clave solo ve tablas expuestas
export async function tablaParaLeer(actor: Actor, nombre: string) {
  const tabla = await tablaExistente(nombre);
  if (actor.tipo === "clave") {
    const config = await configDeTabla(nombre);
    if (!config.expuesta) throw new ErrorApi(404, "tabla_inexistente", `La tabla ${nombre} no existe`);
  }
  return tabla;
}

// escritura: se tienen que cumplir las 4 condiciones
export async function tablaParaEscribir(actor: Actor, nombre: string) {
  const tabla = await tablaExistente(nombre);

  const { modo } = await obtenerModo();
  if (modo !== "escritura") {
    throw new ErrorApi(403, "modo_lectura", "La API está en modo solo lectura");
  }
  if (actor.tipo === "clave" && actor.permiso !== "escritura") {
    throw new ErrorApi(403, "clave_solo_lectura", "Esta clave solo tiene permiso de lectura");
  }
  const config = await configDeTabla(nombre);
  if (!config.expuesta || !config.permiteEscritura) {
    throw new ErrorApi(403, "tabla_solo_lectura", `La tabla ${nombre} no tiene la escritura habilitada`);
  }
  if (tabla.esVista || tabla.clavePrimaria.length === 0) {
    throw new ErrorApi(409, "tabla_sin_clave", "Solo se puede escribir en tablas con clave primaria");
  }
  return tabla;
}
