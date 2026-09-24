import type { z } from "zod";
import type {
  esquemaBuscar, esquemaCrear, esquemaEliminar, esquemaListar, esquemaModificar,
} from "@/validacion/registros";
import type { Actor } from "./actor";
import { tablaParaEscribir, tablaParaLeer } from "./permisos";
import { listarRegistros } from "./listar";
import { buscarRegistro } from "./buscar";
import { crearRegistro, eliminarRegistro, modificarRegistro } from "./escribir";

// cada operacion: primero permisos, despues la consulta
export async function operarListar(actor: Actor, cuerpo: z.infer<typeof esquemaListar>) {
  const tabla = await tablaParaLeer(actor, cuerpo.tabla);
  return listarRegistros(tabla, cuerpo);
}

export async function operarBuscar(actor: Actor, cuerpo: z.infer<typeof esquemaBuscar>) {
  const tabla = await tablaParaLeer(actor, cuerpo.tabla);
  return buscarRegistro(tabla, cuerpo.id);
}

export async function operarCrear(actor: Actor, cuerpo: z.infer<typeof esquemaCrear>) {
  const tabla = await tablaParaEscribir(actor, cuerpo.tabla);
  return crearRegistro(tabla, cuerpo.datos);
}

export async function operarModificar(actor: Actor, cuerpo: z.infer<typeof esquemaModificar>) {
  const tabla = await tablaParaEscribir(actor, cuerpo.tabla);
  return modificarRegistro(tabla, cuerpo.id, cuerpo.datos);
}

export async function operarEliminar(actor: Actor, cuerpo: z.infer<typeof esquemaEliminar>) {
  const tabla = await tablaParaEscribir(actor, cuerpo.tabla);
  return eliminarRegistro(tabla, cuerpo.id);
}
