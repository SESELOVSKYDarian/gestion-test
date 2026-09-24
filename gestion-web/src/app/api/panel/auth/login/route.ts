import { cookies } from "next/headers";
import { leerCuerpo } from "@/lib/http/leer-cuerpo";
import { ipCliente } from "@/lib/http/ip-cliente";
import { respuestaError, respuestaOk } from "@/lib/http/respuestas";
import { COOKIE_SESION, crearTokenSesion, opcionesCookie } from "@/lib/auth/sesion";
import { esquemaLogin } from "@/validacion/panel";
import { validarLogin } from "@/services/usuarios/login";
import { controlarIntentos, limpiarIntentos, sumarFallido } from "@/services/usuarios/limitar-intentos";
import { registrarEvento } from "@/services/auditoria/registrar";

export async function POST(request: Request) {
  const ip = ipCliente(request) || "local";
  try {
    controlarIntentos(ip);
    const { email, password } = await leerCuerpo(request, esquemaLogin);
    const sesion = await validarLogin(email, password).catch((error) => {
      sumarFallido(ip);
      throw error;
    });

    limpiarIntentos(ip);
    (await cookies()).set(COOKIE_SESION, await crearTokenSesion(sesion), opcionesCookie());
    await registrarEvento({ accion: "login", estado: 200, usuarioId: sesion.usuarioId, ip });
    return respuestaOk({ nombre: sesion.nombre });
  } catch (error) {
    return respuestaError(error);
  }
}
