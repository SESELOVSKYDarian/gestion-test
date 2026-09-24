import type { Columna } from "@/tipos/panel";

export type TipoControl =
  | "entero" | "decimal" | "fecha" | "fechaHora" | "hora"
  | "booleano" | "opciones" | "textoLargo" | "texto" | "noEditable";

const ENTEROS = ["tinyint", "smallint", "mediumint", "int", "integer", "bigint", "year"];
const DECIMALES = ["decimal", "numeric", "float", "double", "real"];
const TEXTOS_LARGOS = ["text", "mediumtext", "longtext"];
const TEXTOS = ["char", "varchar", "tinytext"];

// que control de formulario corresponde a cada tipo de columna
export function tipoControl(columna: Columna): TipoControl {
  if (columna.tipoCompleto.startsWith("tinyint(1)")) return "booleano";
  if (ENTEROS.includes(columna.tipo)) return "entero";
  if (DECIMALES.includes(columna.tipo)) return "decimal";
  if (columna.tipo === "date") return "fecha";
  if (columna.tipo === "datetime" || columna.tipo === "timestamp") return "fechaHora";
  if (columna.tipo === "time") return "hora";
  if (columna.tipo === "enum") return "opciones";
  if (TEXTOS_LARGOS.includes(columna.tipo)) return "textoLargo";
  if (TEXTOS.includes(columna.tipo)) return "texto";
  return "noEditable";
}

// enum('a','b') → ["a", "b"]
export function opcionesEnum(columna: Columna): string[] {
  const dentro = columna.tipoCompleto.slice(columna.tipoCompleto.indexOf("(") + 1, -1);
  return dentro.split(/,(?=')/).map((opcion) => opcion.slice(1, -1).replace(/''/g, "'"));
}
