import type { z } from "zod";
import { exigirSesion } from "@/lib/auth/exigir-sesion";
import { autenticarClave } from "@/services/claves/autenticar";
import { controlarLimite } from "@/services/claves/limitar-pedidos";
import { registrarEvento, type Accion } from "@/services/auditoria/registrar";
import type { Actor } from "@/services/registros/actor";
import { ErrorApi } from "./error-api";
import { leerCuerpo } from "./leer-cuerpo";
import { ipCliente } from "./ip-cliente";
import { respuestaError, respuestaOk } from "./respuestas";

type Opciones<T> = {
  origen: "api" | "panel";
  esquema: z.ZodType<T>;
  // si tiene accion, el pedido queda en la auditoria
  accion?: Accion;
  ejecutar: (actor: Actor, cuerpo: T) => Promise<unknown>;
};

async function identificar(origen: "api" | "panel", request: Request): Promise<Actor> {
  if (origen === "panel") {
    const sesion = await exigirSesion();
    return { tipo: "panel", usuarioId: sesion.usuarioId };
  }
  const clave = await autenticarClave(request);
  controlarLimite(clave.id);
  return { tipo: "clave", claveId: clave.id, permiso: clave.permiso };
}

function auditar(accion: Accion | undefined, actor: Actor | null, request: Request, estado: number, tabla: string | null, detalle?: string) {
  if (!accion || !actor) return;
  return registrarEvento({
    accion,
    estado,
    tabla,
    detalle,
    ip: ipCliente(request),
    apiClaveId: actor.tipo === "clave" ? actor.claveId : null,
    usuarioId: actor.tipo === "panel" ? actor.usuarioId : null,
  });
}

// todas las rutas POST pasan por aca: identifico, valido, ejecuto y audito
export function crearRuta<T>({ origen, esquema, accion, ejecutar }: Opciones<T>) {
  return async function POST(request: Request) {
    let actor: Actor | null = null;
    let tabla: string | null = null;
    try {
      actor = await identificar(origen, request);
      const cuerpo = await leerCuerpo(request, esquema);
      tabla = (cuerpo as { tabla?: string }).tabla ?? null;
      const data = await ejecutar(actor, cuerpo);
      await auditar(accion, actor, request, 200, tabla);
      return respuestaOk(data);
    } catch (error) {
      const estado = error instanceof ErrorApi ? error.estado : 500;
      const detalle = error instanceof ErrorApi ? error.message : "error interno";
      await auditar(accion, actor, request, estado, tabla, detalle);
      return respuestaError(error);
    }
  };
}
