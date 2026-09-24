import { ErrorApi } from "@/lib/http/error-api";
import { obtenerSesion, type Sesion } from "./sesion";

// para las rutas /api/panel: sin sesion no pasa
export async function exigirSesion(): Promise<Sesion> {
  const sesion = await obtenerSesion();
  if (!sesion) throw new ErrorApi(401, "sin_sesion", "Tu sesión expiró. Volvé a ingresar.");
  return sesion;
}
