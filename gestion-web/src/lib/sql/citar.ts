// nombres de tabla/columna no se pueden pasar como "?".
// SOLO se usan despues de validarlos contra el esquema real, y ademas se escapan.
export function citar(nombre: string): string {
  return "`" + nombre.replace(/`/g, "``") + "`";
}
