import type { Columna, Fila } from "@/tipos/panel";
import { tipoControl } from "./tipo-control";

export type ValoresFormulario = Record<string, string>;

// del valor de la base al texto del input
function aTexto(columna: Columna, valor: Fila[string] | undefined): string {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (tipoControl(columna) === "fechaHora") return texto.replace(" ", "T");
  return texto;
}

export function valoresIniciales(columnas: Columna[], fila: Fila | null): ValoresFormulario {
  const valores: ValoresFormulario = {};
  for (const columna of columnas) {
    valores[columna.nombre] = fila ? aTexto(columna, fila[columna.nombre]) : "";
  }
  return valores;
}

// del texto del input al valor que espera la API
function aValor(columna: Columna, texto: string): string | null {
  const control = tipoControl(columna);
  if (texto === "" && control !== "texto" && control !== "textoLargo") return null;
  if (texto === "" && columna.aceptaNulo) return null;
  if (control === "fechaHora") return texto.replace("T", " ");
  return texto;
}

// al crear mando lo que se completo; al modificar, solo lo que cambio
export function armarDatos(columnas: Columna[], valores: ValoresFormulario, originales: ValoresFormulario | null) {
  const datos: Record<string, string | null> = {};
  for (const columna of columnas) {
    if (tipoControl(columna) === "noEditable") continue;
    const texto = valores[columna.nombre];
    if (originales) {
      if (columna.esClave || texto === originales[columna.nombre]) continue;
    } else if (texto === "" && (columna.autoIncremental || columna.tieneDefecto)) {
      continue;
    }
    datos[columna.nombre] = aValor(columna, texto);
  }
  return datos;
}

export function idDeFila(clavePrimaria: string[], fila: Fila) {
  const id: Record<string, Fila[string]> = {};
  for (const nombre of clavePrimaria) id[nombre] = fila[nombre];
  return id;
}
