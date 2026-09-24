import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "./panel";
import { ESQUEMA_PANEL } from "./esquema-panel";

// creo las tablas del panel si no existen
async function crearTablas() {
  const db = dbPanel();
  for (const sql of ESQUEMA_PANEL) {
    await db.query(sql);
  }
}

// si no hay usuarios, creo el admin inicial desde el .env
async function crearAdminInicial() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const [filas] = await dbPanel().query<RowDataPacket[]>("SELECT COUNT(*) AS total FROM usuarios");
  if (Number(filas[0].total) > 0) return;

  if (password.length < 10) {
    console.error("[gestion-web] ADMIN_PASSWORD debe tener al menos 10 caracteres");
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  const nombre = process.env.ADMIN_NOMBRE || "Administrador";
  await dbPanel().query(
    "INSERT INTO usuarios (email, nombre, password_hash) VALUES (?, ?, ?)",
    [email.toLowerCase(), nombre, hash],
  );
  console.log(`[gestion-web] admin inicial creado: ${email}`);
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// en Easypanel la base puede tardar en levantar: reintento unas veces
export async function migrarPanel() {
  for (let intento = 1; intento <= 6; intento++) {
    try {
      await crearTablas();
      await crearAdminInicial();
      console.log("[gestion-web] base del panel lista");
      return;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error(`[gestion-web] intento ${intento} de migracion fallido: ${mensaje}`);
      await esperar(3000);
    }
  }
  console.error("[gestion-web] no se pudo preparar la base del panel");
}
