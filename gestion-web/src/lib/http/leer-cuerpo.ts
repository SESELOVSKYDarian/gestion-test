import type { z } from "zod";
import { ErrorApi } from "./error-api";

// leo el json del body y lo valido con zod
export async function leerCuerpo<T>(request: Request, esquema: z.ZodType<T>): Promise<T> {
  const tipo = request.headers.get("content-type") || "";
  if (!tipo.includes("application/json")) {
    throw new ErrorApi(415, "tipo_invalido", "El cuerpo debe ser JSON (Content-Type: application/json)");
  }

  let json: unknown;
  try {
    const texto = await request.text();
    json = texto ? JSON.parse(texto) : {};
  } catch {
    throw new ErrorApi(400, "json_invalido", "El cuerpo no es un JSON válido");
  }

  const resultado = esquema.safeParse(json);
  if (!resultado.success) {
    const detalles = resultado.error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensaje: issue.message,
    }));
    throw new ErrorApi(400, "datos_invalidos", "Los datos enviados no son válidos", detalles);
  }
  return resultado.data;
}
