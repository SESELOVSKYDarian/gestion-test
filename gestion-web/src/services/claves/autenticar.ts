import type { RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";
import { ErrorApi } from "@/lib/http/error-api";
import { secretoValido } from "@/lib/auth/claves-api";
import type { ModoApi } from "@/services/modo/modo";

export type ClaveAutenticada = { id: number; nombre: string; permiso: ModoApi };

function leerCredenciales(request: Request) {
  const publica = request.headers.get("x-api-key")?.trim();
  const autorizacion = request.headers.get("authorization") || "";
  const secreto = autorizacion.startsWith("Bearer ") ? autorizacion.slice(7).trim() : "";
  if (!publica || !secreto) {
    throw new ErrorApi(401, "sin_credenciales", "Faltan las cabeceras x-api-key y Authorization: Bearer");
  }
  return { publica, secreto };
}

// valido clave publica + secreto contra la base del panel
export async function autenticarClave(request: Request): Promise<ClaveAutenticada> {
  const { publica, secreto } = leerCredenciales(request);
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    `SELECT k.id, k.nombre, k.secreto_hash, n.codigo AS permiso
     FROM api_claves k JOIN niveles_acceso n ON n.id = k.nivel_id
     WHERE k.clave_publica = ? AND k.revocada_en IS NULL`,
    [publica],
  );
  const fila = filas[0];
  if (!fila || !secretoValido(secreto, fila.secreto_hash)) {
    throw new ErrorApi(401, "credenciales_invalidas", "Clave de API inválida o revocada");
  }

  await dbPanel().query("UPDATE api_claves SET ultimo_uso_en = NOW() WHERE id = ?", [fila.id]);
  return { id: Number(fila.id), nombre: fila.nombre, permiso: fila.permiso };
}
