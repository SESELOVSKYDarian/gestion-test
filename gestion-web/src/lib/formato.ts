// "2026-09-24 11:51:32" → "24/09/26" (o "24/09/26 11:51" con hora)
export function formatearFecha(valor: string | null | undefined, conHora = false): string {
  if (!valor) return "—";
  const [fecha, hora] = valor.replace("T", " ").split(" ");
  const [anio, mes, dia] = fecha.split("-");
  if (!anio || !mes || !dia) return valor;
  const corta = `${dia}/${mes}/${anio.slice(2)}`;
  if (!conHora || !hora) return corta;
  return `${corta} ${hora.slice(0, 5)}`;
}

export function formatearNumero(valor: number): string {
  return new Intl.NumberFormat("es-AR").format(valor);
}
