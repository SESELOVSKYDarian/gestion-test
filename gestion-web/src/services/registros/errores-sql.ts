import { ErrorApi } from "@/lib/http/error-api";

// traduzco errores comunes de MariaDB a mensajes entendibles
export function traducirErrorSql(error: unknown): never {
  const codigo = (error as { code?: string }).code;
  if (codigo === "ER_DUP_ENTRY") {
    throw new ErrorApi(409, "duplicado", "Ya existe un registro con ese valor único");
  }
  if (codigo === "ER_NO_REFERENCED_ROW_2") {
    throw new ErrorApi(409, "referencia_invalida", "Un valor hace referencia a un registro que no existe");
  }
  if (codigo === "ER_ROW_IS_REFERENCED_2") {
    throw new ErrorApi(409, "registro_en_uso", "No se puede borrar: otros registros dependen de este");
  }
  if (codigo === "ER_TABLEACCESS_DENIED_ERROR") {
    throw new ErrorApi(403, "sin_permiso_db", "El usuario de la base no tiene permiso para esta operación");
  }
  throw error;
}
