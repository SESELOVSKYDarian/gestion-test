import { z } from "zod";

// nombres de tabla/columna: letras, numeros, _ y $ (como MariaDB sin comillas)
export const nombreSql = z
  .string({ error: "Es obligatorio" })
  .min(1, "Es obligatorio")
  .max(64, "Máximo 64 caracteres")
  .regex(/^[A-Za-z0-9_$]+$/, "Solo letras, números, _ y $");

const valorSimple = z.union([z.string().max(65535), z.number(), z.boolean(), z.null()]);
const registro = z.record(nombreSql, valorSimple);

export const esquemaTabla = z.object({ tabla: nombreSql });

export const esquemaListar = z.object({
  tabla: nombreSql,
  pagina: z.number().int().min(1).max(1_000_000).default(1),
  porPagina: z.number().int().min(1).max(200).default(25),
  texto: z.string().trim().max(100).optional(),
  filtros: z.record(nombreSql, z.union([z.string().max(255), z.number(), z.null()])).optional(),
  orden: z.object({ columna: nombreSql, direccion: z.enum(["asc", "desc"]) }).optional(),
});

export const esquemaBuscar = z.object({ tabla: nombreSql, id: registro });
export const esquemaCrear = z.object({ tabla: nombreSql, datos: registro });
export const esquemaModificar = z.object({ tabla: nombreSql, id: registro, datos: registro });
export const esquemaEliminar = z.object({ tabla: nombreSql, id: registro });
