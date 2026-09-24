import type { Pool } from "mysql2/promise";
import { leerEntorno, leerEntornoOpcional } from "@/lib/entorno";
import { crearPool } from "./crear-pool";

// base propia del panel (vive en Easypanel)
const globalPanel = globalThis as unknown as { poolPanel?: Pool };

export function dbPanel(): Pool {
  if (!globalPanel.poolPanel) {
    globalPanel.poolPanel = crearPool({
      host: leerEntorno("PANEL_DB_HOST"),
      port: Number(leerEntornoOpcional("PANEL_DB_PORT", "3306")),
      database: leerEntorno("PANEL_DB_NAME"),
      user: leerEntorno("PANEL_DB_USER"),
      password: leerEntornoOpcional("PANEL_DB_PASSWORD", ""),
    });
  }
  return globalPanel.poolPanel;
}
