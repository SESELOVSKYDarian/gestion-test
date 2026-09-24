import type { Actor } from "@/services/registros/actor";
import { tablaParaLeer } from "@/services/registros/permisos";
import { configDeTabla } from "./tablas-expuestas";

// columnas, clave y si se puede escribir: lo que necesita un cliente para armar formularios
export async function describirTabla(actor: Actor, nombre: string) {
  const tabla = await tablaParaLeer(actor, nombre);
  const config = await configDeTabla(nombre);
  return {
    nombre: tabla.nombre,
    esVista: tabla.esVista,
    filasAprox: tabla.filasAprox,
    clavePrimaria: tabla.clavePrimaria,
    columnas: tabla.columnas,
    expuesta: config.expuesta,
    permiteEscritura: config.permiteEscritura,
  };
}
