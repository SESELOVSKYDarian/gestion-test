import { z } from "zod";
import { nombreSql } from "./registros";

export const esquemaLogin = z.object({
  email: z.email("Email inválido").max(160),
  password: z.string().min(1, "Ingresá la contraseña").max(200),
});

export const esquemaModo = z.object({
  modo: z.enum(["lectura", "escritura"], { error: "Modo inválido" }),
});

export const esquemaNuevaClave = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .max(80, "Máximo 80 caracteres")
    .regex(/^[\p{L}0-9 _.-]+$/u, "Solo letras, números, espacios, punto, guion y guion bajo"),
  permiso: z.enum(["lectura", "escritura"], { error: "Permiso inválido" }),
});

export const esquemaId = z.object({ id: z.number().int().positive() });

export const esquemaConfigTabla = z.object({
  tabla: nombreSql,
  expuesta: z.boolean(),
  permiteEscritura: z.boolean(),
});

export const esquemaListarTablas = z.object({ refrescar: z.boolean().default(false) });

export const esquemaAuditoria = z.object({
  pagina: z.number().int().min(1).default(1),
  porPagina: z.number().int().min(1).max(100).default(30),
  accion: z
    .enum(["tablas", "esquema", "listar", "buscar", "crear", "modificar", "eliminar", "modo", "login"])
    .optional(),
  tabla: z.string().trim().max(64).optional(),
});
