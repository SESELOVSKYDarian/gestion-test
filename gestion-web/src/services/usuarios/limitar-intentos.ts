import { ErrorApi } from "@/lib/http/error-api";

// maximo 8 intentos de login fallidos cada 15 minutos por ip
const MAXIMO = 8;
const VENTANA_MS = 15 * 60_000;
const intentos = new Map<string, { fallidos: number; reinicia: number }>();

export function controlarIntentos(ip: string) {
  const actual = intentos.get(ip);
  if (actual && actual.reinicia > Date.now() && actual.fallidos >= MAXIMO) {
    throw new ErrorApi(429, "demasiados_intentos", "Demasiados intentos. Probá de nuevo en 15 minutos.");
  }
}

export function sumarFallido(ip: string) {
  const actual = intentos.get(ip);
  if (!actual || actual.reinicia < Date.now()) {
    intentos.set(ip, { fallidos: 1, reinicia: Date.now() + VENTANA_MS });
    return;
  }
  actual.fallidos++;
}

export function limpiarIntentos(ip: string) {
  intentos.delete(ip);
}
