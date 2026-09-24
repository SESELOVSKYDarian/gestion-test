import { citar } from "@/lib/sql/citar";

// WHERE `a` = ? AND `b` = ?  para ubicar un registro por su clave primaria
export function whereClave(columnas: string[]): string {
  return columnas.map((columna) => `${citar(columna)} = ?`).join(" AND ");
}
