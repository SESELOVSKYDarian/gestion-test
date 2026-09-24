import type { RowDataPacket } from "mysql2/promise";
import { dbLegacy } from "@/lib/db/legacy";
import { citar } from "@/lib/sql/citar";
import { ErrorApi } from "@/lib/http/error-api";
import type { TablaLegacy } from "@/services/esquema/tipos";

const TIPOS_TEXTO = ["char", "varchar", "tinytext", "text", "mediumtext", "longtext", "enum"];

export type OpcionesListado = {
  pagina: number;
  porPagina: number;
  texto?: string;
  filtros?: Record<string, string | number | null>;
  orden?: { columna: string; direccion: "asc" | "desc" };
};

function existeColumna(tabla: TablaLegacy, nombre: string) {
  return tabla.columnas.some((columna) => columna.nombre === nombre);
}

// filtros exactos por columna + busqueda de texto en las columnas de texto
function armarWhere(tabla: TablaLegacy, opciones: OpcionesListado) {
  const partes: string[] = [];
  const valores: unknown[] = [];

  for (const [columna, valor] of Object.entries(opciones.filtros || {})) {
    if (!existeColumna(tabla, columna)) throw new ErrorApi(400, "columna_inexistente", `No existe la columna ${columna}`);
    partes.push(valor === null ? `${citar(columna)} IS NULL` : `${citar(columna)} = ?`);
    if (valor !== null) valores.push(valor);
  }

  if (opciones.texto) {
    const textuales = tabla.columnas.filter((c) => TIPOS_TEXTO.includes(c.tipo)).slice(0, 10);
    if (textuales.length > 0) {
      partes.push(`(${textuales.map((c) => `${citar(c.nombre)} LIKE ?`).join(" OR ")})`);
      for (let i = 0; i < textuales.length; i++) valores.push(`%${opciones.texto}%`);
    }
  }
  return { where: partes.length > 0 ? `WHERE ${partes.join(" AND ")}` : "", valores };
}

function armarOrden(tabla: TablaLegacy, opciones: OpcionesListado) {
  const orden = opciones.orden;
  if (orden) {
    if (!existeColumna(tabla, orden.columna)) throw new ErrorApi(400, "columna_inexistente", `No existe la columna ${orden.columna}`);
    return `ORDER BY ${citar(orden.columna)} ${orden.direccion === "desc" ? "DESC" : "ASC"}`;
  }
  if (tabla.clavePrimaria.length > 0) return `ORDER BY ${tabla.clavePrimaria.map(citar).join(", ")}`;
  return "";
}

export async function listarRegistros(tabla: TablaLegacy, opciones: OpcionesListado) {
  const { where, valores } = armarWhere(tabla, opciones);
  const orden = armarOrden(tabla, opciones);
  const desde = (opciones.pagina - 1) * opciones.porPagina;
  const db = dbLegacy("lectura");

  const [filas] = await db.query<RowDataPacket[]>(
    `SELECT * FROM ${citar(tabla.nombre)} ${where} ${orden} LIMIT ? OFFSET ?`,
    [...valores, opciones.porPagina, desde],
  );
  const [conteo] = await db.query<RowDataPacket[]>(
    `SELECT COUNT(*) AS total FROM ${citar(tabla.nombre)} ${where}`,
    valores,
  );

  return {
    tabla: tabla.nombre,
    columnas: tabla.columnas,
    clavePrimaria: tabla.clavePrimaria,
    filas,
    total: Number(conteo[0].total),
    pagina: opciones.pagina,
    porPagina: opciones.porPagina,
  };
}
