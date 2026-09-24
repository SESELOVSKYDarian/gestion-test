import { leerEsquema } from "./leer-esquema";
import { leerTablasExpuestas } from "./tablas-expuestas";

type Opciones = { soloExpuestas: boolean; forzar?: boolean };

// tablas de la base vieja con su configuracion de exposicion
export async function listarTablas({ soloExpuestas, forzar = false }: Opciones) {
  const esquema = await leerEsquema(forzar);
  const expuestas = await leerTablasExpuestas();
  const resultado = [];

  for (const tabla of esquema.values()) {
    const config = expuestas.get(tabla.nombre);
    if (soloExpuestas && !config) continue;
    resultado.push({
      nombre: tabla.nombre,
      esVista: tabla.esVista,
      filasAprox: tabla.filasAprox,
      columnas: tabla.columnas.length,
      clavePrimaria: tabla.clavePrimaria,
      expuesta: Boolean(config),
      permiteEscritura: config ? config.permiteEscritura : false,
    });
  }
  return resultado;
}
