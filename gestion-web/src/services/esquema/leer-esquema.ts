import type { RowDataPacket } from "mysql2/promise";
import { dbLegacy, nombreBaseLegacy } from "@/lib/db/legacy";
import type { Columna, EsquemaLegacy, TablaLegacy } from "./tipos";

const DURACION_CACHE_MS = 60_000;
let cache: { esquema: EsquemaLegacy; vence: number } | null = null;

async function leerTablas(): Promise<EsquemaLegacy> {
  const [filas] = await dbLegacy("lectura").query<RowDataPacket[]>(
    `SELECT TABLE_NAME, TABLE_TYPE, TABLE_ROWS FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME`,
    [nombreBaseLegacy()],
  );
  const esquema: EsquemaLegacy = new Map();
  for (const fila of filas) {
    esquema.set(fila.TABLE_NAME, {
      nombre: fila.TABLE_NAME,
      esVista: fila.TABLE_TYPE === "VIEW",
      filasAprox: Number(fila.TABLE_ROWS || 0),
      columnas: [],
      clavePrimaria: [],
    });
  }
  return esquema;
}

function armarColumna(fila: RowDataPacket): Columna {
  const defecto = fila.COLUMN_DEFAULT;
  return {
    nombre: fila.COLUMN_NAME,
    tipo: String(fila.DATA_TYPE).toLowerCase(),
    tipoCompleto: fila.COLUMN_TYPE,
    aceptaNulo: fila.IS_NULLABLE === "YES",
    // MariaDB devuelve el texto 'NULL' cuando el defecto es null
    tieneDefecto: defecto !== null && defecto !== "NULL",
    autoIncremental: String(fila.EXTRA).includes("auto_increment"),
    largoMaximo: fila.CHARACTER_MAXIMUM_LENGTH === null ? null : Number(fila.CHARACTER_MAXIMUM_LENGTH),
    esClave: fila.COLUMN_KEY === "PRI",
  };
}

async function agregarColumnas(esquema: EsquemaLegacy) {
  const [filas] = await dbLegacy("lectura").query<RowDataPacket[]>(
    `SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT,
            EXTRA, CHARACTER_MAXIMUM_LENGTH, COLUMN_KEY
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? ORDER BY TABLE_NAME, ORDINAL_POSITION`,
    [nombreBaseLegacy()],
  );
  for (const fila of filas) {
    const tabla = esquema.get(fila.TABLE_NAME);
    if (!tabla) continue;
    const columna = armarColumna(fila);
    tabla.columnas.push(columna);
    if (columna.esClave) tabla.clavePrimaria.push(columna.nombre);
  }
}

// esquema completo de la base vieja, con cache de 1 minuto
export async function leerEsquema(forzar = false): Promise<EsquemaLegacy> {
  if (!forzar && cache && cache.vence > Date.now()) return cache.esquema;
  const esquema = await leerTablas();
  await agregarColumnas(esquema);
  cache = { esquema, vence: Date.now() + DURACION_CACHE_MS };
  return esquema;
}

export async function buscarTabla(nombre: string): Promise<TablaLegacy | undefined> {
  const esquema = await leerEsquema();
  return esquema.get(nombre);
}
