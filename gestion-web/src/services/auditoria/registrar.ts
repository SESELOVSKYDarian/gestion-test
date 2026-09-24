import { dbPanel } from "@/lib/db/panel";

export type Accion =
  | "tablas" | "esquema" | "listar" | "buscar"
  | "crear" | "modificar" | "eliminar" | "modo" | "login";

export type Evento = {
  accion: Accion;
  estado: number;
  tabla?: string | null;
  detalle?: string | null;
  apiClaveId?: number | null;
  usuarioId?: number | null;
  ip?: string | null;
};

// guardo el evento; si falla la auditoria no rompo la respuesta
export async function registrarEvento(evento: Evento) {
  try {
    await dbPanel().query(
      `INSERT INTO auditoria (api_clave_id, usuario_id, accion, tabla, estado, detalle, ip)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        evento.apiClaveId ?? null,
        evento.usuarioId ?? null,
        evento.accion,
        evento.tabla ?? null,
        evento.estado,
        evento.detalle ? evento.detalle.slice(0, 255) : null,
        evento.ip ?? null,
      ],
    );
  } catch (error) {
    console.error("[gestion-web] no se pudo auditar", error);
  }
}
