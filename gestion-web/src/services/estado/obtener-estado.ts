import { dbPanel } from "@/lib/db/panel";
import { dbLegacy } from "@/lib/db/legacy";
import { leerEsquema } from "@/services/esquema/leer-esquema";
import { listarAuditoria } from "@/services/auditoria/listar";
import { obtenerModo } from "@/services/modo/modo";
import { probarConexion } from "./probar-conexion";
import { contadoresDelDia } from "./contadores";

async function contarTablasLegacy() {
  try {
    return (await leerEsquema()).size;
  } catch {
    return null;
  }
}

// todo lo que muestra la pantalla de inicio, en un solo pedido
export async function obtenerEstado() {
  const [conexiones, tablasTotales, contadores, modo, actividad] = await Promise.all([
    Promise.all([
      probarConexion("Base del panel", dbPanel),
      probarConexion("Sistema viejo · lectura", () => dbLegacy("lectura")),
      probarConexion("Sistema viejo · escritura", () => dbLegacy("escritura")),
    ]),
    contarTablasLegacy(),
    contadoresDelDia(),
    obtenerModo(),
    listarAuditoria({ pagina: 1, porPagina: 6 }),
  ]);
  return { conexiones, tablasTotales, ...contadores, modo, actividad: actividad.eventos };
}
