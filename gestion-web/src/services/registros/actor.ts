import type { ModoApi } from "@/services/modo/modo";

// quien hace el pedido: una clave de la API o un usuario del panel
export type Actor =
  | { tipo: "clave"; claveId: number; permiso: ModoApi }
  | { tipo: "panel"; usuarioId: number };
