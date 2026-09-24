import { ErrorApi } from "@/lib/http/error-api";
import type { Actor } from "@/services/registros/actor";

// id del usuario del panel (las rutas del panel siempre tienen uno)
export function usuarioDe(actor: Actor): number {
  if (actor.tipo !== "panel") throw new ErrorApi(403, "solo_panel", "Acción disponible solo desde el panel");
  return actor.usuarioId;
}
