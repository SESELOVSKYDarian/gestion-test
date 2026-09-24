import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";
import { ErrorApi } from "@/lib/http/error-api";
import type { Sesion } from "@/lib/auth/sesion";

// hash de referencia para tardar lo mismo aunque el email no exista
const HASH_FALSO = bcrypt.hashSync("usuario-inexistente", 12);

export async function validarLogin(email: string, password: string): Promise<Sesion> {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    "SELECT id, email, nombre, password_hash FROM usuarios WHERE email = ?",
    [email.toLowerCase()],
  );
  const usuario = filas[0];
  const correcta = await bcrypt.compare(password, usuario ? usuario.password_hash : HASH_FALSO);
  if (!usuario || !correcta) {
    throw new ErrorApi(401, "login_invalido", "Email o contraseña incorrectos");
  }
  return { usuarioId: Number(usuario.id), email: usuario.email, nombre: usuario.nombre };
}
