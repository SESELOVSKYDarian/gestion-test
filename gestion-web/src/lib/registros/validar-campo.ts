import type { Columna } from "@/tipos/panel";
import { tipoControl } from "./tipo-control";

// misma idea que la validacion del servidor, para avisar antes de enviar
export function validarCampo(columna: Columna, valor: string, creando: boolean): string | null {
  const control = tipoControl(columna);
  const obligatoria = !columna.aceptaNulo && !(creando && (columna.tieneDefecto || columna.autoIncremental));
  const esTexto = control === "texto" || control === "textoLargo";

  if (valor === "") {
    if (obligatoria && !esTexto) return "Es obligatorio";
    if (obligatoria && esTexto && !columna.tieneDefecto) return "Es obligatorio";
    return null;
  }
  if (control === "entero" && !/^-?\d+$/.test(valor.trim())) return "Tiene que ser un número entero";
  if (control === "decimal" && !/^-?\d+(\.\d+)?$/.test(valor.trim())) return "Tiene que ser un número (usá punto decimal)";
  if (control === "fecha" && Number.isNaN(Date.parse(valor))) return "Fecha inválida";
  if (control === "fechaHora" && Number.isNaN(Date.parse(valor))) return "Fecha y hora inválidas";
  if (columna.largoMaximo !== null && valor.length > columna.largoMaximo) {
    return `Máximo ${columna.largoMaximo} caracteres`;
  }
  return null;
}
