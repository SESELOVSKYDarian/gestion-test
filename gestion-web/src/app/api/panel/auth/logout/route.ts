import { cookies } from "next/headers";
import { respuestaOk } from "@/lib/http/respuestas";
import { COOKIE_SESION } from "@/lib/auth/sesion";

export async function POST() {
  (await cookies()).delete(COOKIE_SESION);
  return respuestaOk({ salio: true });
}
