import type { Pool } from "mysql2/promise";

export type EstadoConexion = { nombre: string; ok: boolean; ms: number | null; mensaje: string };

// hago un SELECT 1 y mido cuanto tarda
export async function probarConexion(nombre: string, obtenerPool: () => Pool): Promise<EstadoConexion> {
  const inicio = Date.now();
  try {
    await obtenerPool().query("SELECT 1");
    return { nombre, ok: true, ms: Date.now() - inicio, mensaje: "Conectada" };
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Sin conexión";
    return { nombre, ok: false, ms: null, mensaje: mensaje.slice(0, 140) };
  }
}
