import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";

type Filtros = { pagina: number; porPagina: number; accion?: string; tabla?: string };

function armarWhere(filtros: Filtros) {
  const condiciones: string[] = [];
  const valores: unknown[] = [];
  if (filtros.accion) {
    condiciones.push("a.accion = ?");
    valores.push(filtros.accion);
  }
  if (filtros.tabla) {
    condiciones.push("a.tabla LIKE ?");
    valores.push(`%${filtros.tabla}%`);
  }
  const where = condiciones.length > 0 ? `WHERE ${condiciones.join(" AND ")}` : "";
  return { where, valores };
}

// historial de pedidos, del mas nuevo al mas viejo
export async function listarAuditoria(filtros: Filtros) {
  const { where, valores } = armarWhere(filtros);
  const desde = (filtros.pagina - 1) * filtros.porPagina;

  const [filas] = await dbPanel().query<RowDataPacket[]>(
    `SELECT a.id, a.accion, a.tabla, a.estado, a.detalle, a.ip, a.creado_en,
            k.nombre AS clave, u.nombre AS usuario
     FROM auditoria a
     LEFT JOIN api_claves k ON k.id = a.api_clave_id
     LEFT JOIN usuarios u ON u.id = a.usuario_id
     ${where}
     ORDER BY a.id DESC LIMIT ? OFFSET ?`,
    [...valores, filtros.porPagina, desde],
  );
  const [conteo] = await dbPanel().query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM auditoria a ${where}`,
    valores,
  );

  const eventos = filas.map((fila) => ({
    id: Number(fila.id),
    accion: fila.accion,
    tabla: fila.tabla,
    estado: fila.estado,
    detalle: fila.detalle,
    ip: fila.ip,
    fecha: fila.creado_en,
    origen: fila.clave ? `Clave: ${fila.clave}` : fila.usuario ? `Panel: ${fila.usuario}` : "Anónimo",
  }));
  return { eventos, total: Number(conteo[0].total) };
}
