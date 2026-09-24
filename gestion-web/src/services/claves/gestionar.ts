import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbPanel } from "@/lib/db/panel";
import { ErrorApi } from "@/lib/http/error-api";
import { generarClavePublica, generarSecreto, hashSecreto } from "@/lib/auth/claves-api";
import type { ModoApi } from "@/services/modo/modo";

export async function listarClaves() {
  const [filas] = await dbPanel().query<RowDataPacket[]>(
    `SELECT k.id, k.nombre, k.clave_publica, n.codigo AS permiso,
            k.creada_en, k.ultimo_uso_en, k.revocada_en, u.nombre AS creador
     FROM api_claves k
     JOIN niveles_acceso n ON n.id = k.nivel_id
     LEFT JOIN usuarios u ON u.id = k.creada_por
     ORDER BY k.revocada_en IS NOT NULL, k.id DESC`,
  );
  return filas.map((fila) => ({
    id: Number(fila.id),
    nombre: fila.nombre,
    clavePublica: fila.clave_publica,
    permiso: fila.permiso as ModoApi,
    creadaEn: fila.creada_en,
    ultimoUsoEn: fila.ultimo_uso_en,
    revocadaEn: fila.revocada_en,
    creador: fila.creador,
  }));
}

type NuevaClave = { nombre: string; permiso: ModoApi; usuarioId: number };

// el secreto se devuelve UNA sola vez; en la base queda solo el hash
export async function crearClave({ nombre, permiso, usuarioId }: NuevaClave) {
  const clavePublica = generarClavePublica();
  const secreto = generarSecreto();
  await dbPanel().query(
    `INSERT INTO api_claves (nombre, clave_publica, secreto_hash, nivel_id, creada_por)
     VALUES (?, ?, ?, (SELECT id FROM niveles_acceso WHERE codigo = ?), ?)`,
    [nombre, clavePublica, hashSecreto(secreto), permiso, usuarioId],
  );
  return { nombre, permiso, clavePublica, secreto };
}

export async function revocarClave(id: number) {
  const [resultado] = await dbPanel().query<ResultSetHeader>(
    "UPDATE api_claves SET revocada_en = NOW() WHERE id = ? AND revocada_en IS NULL",
    [id],
  );
  if (resultado.affectedRows === 0) {
    throw new ErrorApi(404, "clave_inexistente", "La clave no existe o ya estaba revocada");
  }
  return { id };
}
