import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// clave publica: identifica quien llama. secreto: prueba que es el
export function generarClavePublica() {
  return `gw_pub_${randomBytes(16).toString("hex")}`;
}

export function generarSecreto() {
  return `gw_sec_${randomBytes(32).toString("base64url")}`;
}

// el secreto es aleatorio y largo: alcanza con sha256 (no hace falta bcrypt)
export function hashSecreto(secreto: string) {
  return createHash("sha256").update(secreto).digest("hex");
}

export function secretoValido(secreto: string, hashGuardado: string) {
  const a = Buffer.from(hashSecreto(secreto), "hex");
  const b = Buffer.from(hashGuardado, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
