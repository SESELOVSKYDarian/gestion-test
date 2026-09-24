import type { Pool } from "mysql2/promise";
import { leerEntorno, leerEntornoOpcional } from "@/lib/entorno";
import { crearPool } from "./crear-pool";

// base del sistema de gestion viejo: un usuario para leer y otro para escribir
type TipoAcceso = "lectura" | "escritura";

const globalLegacy = globalThis as unknown as {
  poolsLegacy?: Partial<Record<TipoAcceso, Pool>>;
};

function datosDe(tipo: TipoAcceso) {
  const prefijo = tipo === "lectura" ? "LEGACY_DB_READ" : "LEGACY_DB_WRITE";
  return {
    host: leerEntorno("LEGACY_DB_HOST"),
    port: Number(leerEntornoOpcional("LEGACY_DB_PORT", "3306")),
    database: leerEntorno("LEGACY_DB_NAME"),
    user: leerEntorno(`${prefijo}_USER`),
    password: leerEntornoOpcional(`${prefijo}_PASSWORD`, ""),
  };
}

export function dbLegacy(tipo: TipoAcceso): Pool {
  if (!globalLegacy.poolsLegacy) globalLegacy.poolsLegacy = {};
  const pools = globalLegacy.poolsLegacy;
  if (!pools[tipo]) pools[tipo] = crearPool(datosDe(tipo));
  return pools[tipo];
}

export function nombreBaseLegacy(): string {
  return leerEntorno("LEGACY_DB_NAME");
}
