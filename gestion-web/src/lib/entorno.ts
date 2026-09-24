// leo variables de entorno y aviso claro si falta alguna
export function leerEntorno(nombre: string): string {
  const valor = process.env[nombre];
  if (valor === undefined || valor === "") {
    throw new Error(`Falta la variable de entorno ${nombre}`);
  }
  return valor;
}

export function leerEntornoOpcional(nombre: string, porDefecto: string): string {
  const valor = process.env[nombre];
  if (valor === undefined || valor === "") return porDefecto;
  return valor;
}
