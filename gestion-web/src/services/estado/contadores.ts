import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";

// numeros del dia para las tarjetas del inicio
export async function contadoresDelDia() {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    `SELECT
       (SELECT COUNT(*) FROM tablas_expuestas) AS expuestas,
       (SELECT COUNT(*) FROM api_claves WHERE revocada_en IS NULL) AS claves,
       (SELECT COUNT(*) FROM auditoria WHERE api_clave_id IS NOT NULL AND creado_en >= CURDATE()) AS pedidos,
       (SELECT COUNT(*) FROM auditoria WHERE accion IN ('crear','modificar','eliminar')
          AND estado = 200 AND creado_en >= CURDATE()) AS escrituras,
       (SELECT COUNT(*) FROM auditoria WHERE estado >= 400 AND creado_en >= CURDATE()) AS rechazados`,
  );
  const fila = filas[0];
  return {
    tablasExpuestas: Number(fila.expuestas),
    clavesActivas: Number(fila.claves),
    pedidosHoy: Number(fila.pedidos),
    escriturasHoy: Number(fila.escrituras),
    rechazadosHoy: Number(fila.rechazados),
  };
}
