import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";

export type ConfigTabla = { expuesta: boolean; permiteEscritura: boolean };

// configuracion de exposicion de cada tabla (lo que no esta, no se expone)
export async function leerTablasExpuestas(): Promise<Map<string, ConfigTabla>> {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    "SELECT nombre, permite_escritura FROM tablas_expuestas",
  );
  const mapa = new Map<string, ConfigTabla>();
  for (const fila of filas) {
    mapa.set(fila.nombre, { expuesta: true, permiteEscritura: Boolean(fila.permite_escritura) });
  }
  return mapa;
}

export async function configDeTabla(nombre: string): Promise<ConfigTabla> {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    "SELECT permite_escritura FROM tablas_expuestas WHERE nombre = ?",
    [nombre],
  );
  if (filas.length === 0) return { expuesta: false, permiteEscritura: false };
  return { expuesta: true, permiteEscritura: Boolean(filas[0].permite_escritura) };
}
