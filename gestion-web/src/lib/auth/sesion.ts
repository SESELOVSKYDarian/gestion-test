import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { leerEntorno } from "@/lib/entorno";

export const COOKIE_SESION = "gw_sesion";
const DURACION_HORAS = 8;

export type Sesion = {
  usuarioId: number;
  email: string;
  nombre: string;
};

function claveSesion() {
  const secreto = leerEntorno("SESSION_SECRET");
  if (secreto.length < 32) throw new Error("SESSION_SECRET debe tener al menos 32 caracteres");
  return new TextEncoder().encode(secreto);
}

export async function crearTokenSesion(sesion: Sesion) {
  return new SignJWT({ email: sesion.email, nombre: sesion.nombre })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(sesion.usuarioId))
    .setIssuedAt()
    .setExpirationTime(`${DURACION_HORAS}h`)
    .sign(claveSesion());
}

export function opcionesCookie() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.COOKIE_SECURE !== "false",
    path: "/",
    maxAge: DURACION_HORAS * 60 * 60,
  };
}

// leo la cookie y devuelvo la sesion o null
export async function obtenerSesion(): Promise<Sesion | null> {
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, claveSesion());
    return {
      usuarioId: Number(payload.sub),
      email: String(payload.email),
      nombre: String(payload.nombre),
    };
  } catch {
    return null;
  }
}
