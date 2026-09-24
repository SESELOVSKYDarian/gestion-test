import type { ResultSetHeader } from "mysql2/promise";
import { dbLegacy } from "@/lib/db/legacy";
import { citar } from "@/lib/sql/citar";
import { ErrorApi } from "@/lib/http/error-api";
import type { TablaLegacy } from "@/services/esquema/tipos";
import { prepararDatos, prepararId } from "./preparar-datos";
import { whereClave } from "./where-clave";
import { traducirErrorSql } from "./errores-sql";
import { buscarRegistro } from "./buscar";

type Datos = Record<string, unknown>;

// armo el id del registro recien creado (autoincremental o enviado)
function idCreado(tabla: TablaLegacy, datos: Datos, insertId: number): Datos {
  const id: Datos = {};
  for (const nombre of tabla.clavePrimaria) {
    const columna = tabla.columnas.find((c) => c.nombre === nombre);
    id[nombre] = columna?.autoIncremental && !(nombre in datos) ? insertId : datos[nombre];
  }
  return id;
}

export async function crearRegistro(tabla: TablaLegacy, datos: Datos) {
  const { columnas, valores } = prepararDatos(tabla, datos, "crear");
  const marcas = columnas.map(() => "?").join(", ");
  try {
    const [resultado] = await dbLegacy("escritura").query<ResultSetHeader>(
      `INSERT INTO ${citar(tabla.nombre)} (${columnas.map(citar).join(", ")}) VALUES (${marcas})`,
      valores,
    );
    const id = idCreado(tabla, datos, resultado.insertId);
    return { id, registro: await buscarRegistro(tabla, id) };
  } catch (error) {
    traducirErrorSql(error);
  }
}

export async function modificarRegistro(tabla: TablaLegacy, id: Datos, datos: Datos) {
  const clave = prepararId(tabla, id);
  const { columnas, valores } = prepararDatos(tabla, datos, "modificar");
  const sets = columnas.map((columna) => `${citar(columna)} = ?`).join(", ");
  try {
    const [resultado] = await dbLegacy("escritura").query<ResultSetHeader>(
      `UPDATE ${citar(tabla.nombre)} SET ${sets} WHERE ${whereClave(clave.columnas)} LIMIT 1`,
      [...valores, ...clave.valores],
    );
    if (resultado.affectedRows === 0) throw new ErrorApi(404, "registro_inexistente", "No se encontró el registro");
    return { id, registro: await buscarRegistro(tabla, id) };
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    traducirErrorSql(error);
  }
}

export async function eliminarRegistro(tabla: TablaLegacy, id: Datos) {
  const clave = prepararId(tabla, id);
  try {
    const [resultado] = await dbLegacy("escritura").query<ResultSetHeader>(
      `DELETE FROM ${citar(tabla.nombre)} WHERE ${whereClave(clave.columnas)} LIMIT 1`,
      clave.valores,
    );
    if (resultado.affectedRows === 0) throw new ErrorApi(404, "registro_inexistente", "No se encontró el registro");
    return { id, eliminado: true };
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    traducirErrorSql(error);
  }
}
