import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";

export type ModoApi = "lectura" | "escritura";

export type EstadoModo = {
  modo: ModoApi;
  actualizadoEn: string;
  actualizadoPor: string | null;
};

// modo global de la API: lectura o lectura + escritura
export async function obtenerModo(): Promise<EstadoModo> {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    `SELECT n.codigo, c.actualizado_en, u.nombre AS usuario
     FROM configuracion_api c
     JOIN niveles_acceso n ON n.id = c.nivel_id
     LEFT JOIN usuarios u ON u.id = c.actualizado_por
     WHERE c.id = 1`,
  );
  const fila = filas[0];
  if (!fila) return { modo: "lectura", actualizadoEn: "", actualizadoPor: null };
  return {
    modo: fila.codigo === "escritura" ? "escritura" : "lectura",
    actualizadoEn: fila.actualizado_en,
    actualizadoPor: fila.usuario,
  };
}

export async function cambiarModo(modo: ModoApi, usuarioId: number): Promise<EstadoModo> {
  await dbPanel().query(
    `UPDATE configuracion_api
     SET nivel_id = (SELECT id FROM niveles_acceso WHERE codigo = ?),
         actualizado_por = ?, actualizado_en = NOW()
     WHERE id = 1`,
    [modo, usuarioId],
  );
  return obtenerModo();
}
