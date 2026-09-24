import { dbPanel } from "@/lib/db/panel";
import { ErrorApi } from "@/lib/http/error-api";
import { buscarTabla } from "./leer-esquema";

type Cambio = { tabla: string; expuesta: boolean; permiteEscritura: boolean };

// expongo / oculto una tabla y habilito o no su escritura
export async function configurarTabla({ tabla, expuesta, permiteEscritura }: Cambio) {
  const datos = await buscarTabla(tabla);
  if (!datos) throw new ErrorApi(404, "tabla_inexistente", `La tabla ${tabla} no existe`);

  if (!expuesta) {
    await dbPanel().query("DELETE FROM tablas_expuestas WHERE nombre = ?", [tabla]);
    return { tabla, expuesta: false, permiteEscritura: false };
  }

  const puedeEscribir = !datos.esVista && datos.clavePrimaria.length > 0;
  if (permiteEscritura && !puedeEscribir) {
    throw new ErrorApi(409, "tabla_sin_clave", "Solo se puede escribir en tablas con clave primaria");
  }

  await dbPanel().query(
    `INSERT INTO tablas_expuestas (nombre, permite_escritura) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE permite_escritura = VALUES(permite_escritura)`,
    [tabla, permiteEscritura ? 1 : 0],
  );
  return { tabla, expuesta: true, permiteEscritura };
}
