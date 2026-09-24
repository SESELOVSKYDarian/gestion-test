import type { RowDataPacket } from "mysql2/promise";
import { dbLegacy } from "@/lib/db/legacy";
import { citar } from "@/lib/sql/citar";
import { ErrorApi } from "@/lib/http/error-api";
import type { TablaLegacy } from "@/services/esquema/tipos";
import { prepararId } from "./preparar-datos";
import { whereClave } from "./where-clave";

// un registro por su clave primaria
export async function buscarRegistro(tabla: TablaLegacy, id: Record<string, unknown>) {
  if (tabla.clavePrimaria.length === 0) {
    throw new ErrorApi(409, "tabla_sin_clave", "La tabla no tiene clave primaria: usá listar con filtros");
  }
  const clave = prepararId(tabla, id);
  const [filas] = await dbLegacy("lectura").query<RowDataPacket[]>(
    `SELECT * FROM ${citar(tabla.nombre)} WHERE ${whereClave(clave.columnas)} LIMIT 1`,
    clave.valores,
  );
  if (filas.length === 0) throw new ErrorApi(404, "registro_inexistente", "No se encontró el registro");
  return filas[0];
}
