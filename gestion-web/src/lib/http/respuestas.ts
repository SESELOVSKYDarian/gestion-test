import { NextResponse } from "next/server";
import { ErrorApi } from "./error-api";

export function respuestaOk(data: unknown, estado = 200) {
  return NextResponse.json({ ok: true, data }, { status: estado });
}

export function respuestaError(error: unknown) {
  if (error instanceof ErrorApi) {
    return NextResponse.json(
      { ok: false, error: { codigo: error.codigo, mensaje: error.message, detalles: error.detalles } },
      { status: error.estado },
    );
  }
  // error inesperado: lo logueo y no expongo detalles internos
  console.error("[gestion-web]", error);
  return NextResponse.json(
    { ok: false, error: { codigo: "error_interno", mensaje: "Ocurrió un error inesperado" } },
    { status: 500 },
  );
}
