import type { Columna } from "@/services/esquema/tipos";

const ENTEROS = ["tinyint", "smallint", "mediumint", "int", "integer", "bigint", "year"];
const DECIMALES = ["decimal", "numeric", "float", "double", "real"];
const TEXTOS = ["char", "varchar", "tinytext", "text", "mediumtext", "longtext", "enum", "set"];

type Resultado = { ok: true; valor: unknown } | { ok: false; mensaje: string };

function validarEntero(valor: unknown): Resultado {
  if (typeof valor === "boolean") return { ok: true, valor: valor ? 1 : 0 };
  const texto = String(valor).trim();
  if (!/^-?\d+$/.test(texto)) return { ok: false, mensaje: "debe ser un número entero" };
  return { ok: true, valor: texto };
}

function validarDecimal(valor: unknown): Resultado {
  const texto = String(valor).trim();
  if (!/^-?\d+(\.\d+)?$/.test(texto)) return { ok: false, mensaje: "debe ser un número (use punto decimal)" };
  return { ok: true, valor: texto };
}

function validarFecha(valor: unknown, tipo: string): Resultado {
  const texto = String(valor).trim().replace("T", " ");
  const patrones: Record<string, RegExp> = {
    date: /^\d{4}-\d{2}-\d{2}$/,
    time: /^\d{2}:\d{2}(:\d{2})?$/,
    datetime: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/,
    timestamp: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/,
  };
  if (!patrones[tipo].test(texto)) return { ok: false, mensaje: `formato inválido para ${tipo}` };
  if (tipo !== "time" && Number.isNaN(Date.parse(texto.slice(0, 10)))) {
    return { ok: false, mensaje: "fecha inexistente" };
  }
  return { ok: true, valor: texto };
}

function validarTexto(valor: unknown, columna: Columna): Resultado {
  if (typeof valor !== "string" && typeof valor !== "number") return { ok: false, mensaje: "debe ser texto" };
  const texto = String(valor);
  if (columna.largoMaximo !== null && texto.length > columna.largoMaximo) {
    return { ok: false, mensaje: `máximo ${columna.largoMaximo} caracteres` };
  }
  return { ok: true, valor: texto };
}

// valido un valor segun el tipo real de la columna
export function validarValor(columna: Columna, valor: unknown): Resultado {
  // texto vacio en columnas no-texto lo tomo como "sin valor"
  const vacio = valor === "" && !TEXTOS.includes(columna.tipo);
  if (valor === null || valor === undefined || vacio) {
    if (columna.aceptaNulo) return { ok: true, valor: null };
    return { ok: false, mensaje: "es obligatorio" };
  }
  if (ENTEROS.includes(columna.tipo)) return validarEntero(valor);
  if (DECIMALES.includes(columna.tipo)) return validarDecimal(valor);
  if (["date", "time", "datetime", "timestamp"].includes(columna.tipo)) return validarFecha(valor, columna.tipo);
  if (TEXTOS.includes(columna.tipo)) return validarTexto(valor, columna);
  return { ok: false, mensaje: `el tipo ${columna.tipo} no se puede editar desde la API` };
}
