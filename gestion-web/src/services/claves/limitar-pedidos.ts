import { ErrorApi } from "@/lib/http/error-api";

// limite simple en memoria: 120 pedidos por minuto por clave
const LIMITE = 120;
const VENTANA_MS = 60_000;
const contadores = new Map<number, { cantidad: number; reinicia: number }>();

export function controlarLimite(claveId: number) {
  const ahora = Date.now();
  const actual = contadores.get(claveId);

  if (!actual || actual.reinicia < ahora) {
    contadores.set(claveId, { cantidad: 1, reinicia: ahora + VENTANA_MS });
    return;
  }
  actual.cantidad++;
  if (actual.cantidad > LIMITE) {
    throw new ErrorApi(429, "demasiados_pedidos", "Superaste el límite de 120 pedidos por minuto");
  }
}
