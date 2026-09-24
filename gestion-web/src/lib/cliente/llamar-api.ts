export type DetalleError = { campo: string; mensaje: string };

export class ErrorCliente extends Error {
  estado: number;
  codigo: string;
  detalles: DetalleError[];

  constructor(estado: number, codigo: string, mensaje: string, detalles: DetalleError[] = []) {
    super(mensaje);
    this.estado = estado;
    this.codigo = codigo;
    this.detalles = detalles;
  }
}

// el panel consume su propia API: siempre POST con JSON
export async function llamarApi<T>(ruta: string, cuerpo: object = {}): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorCliente(0, "sin_red", "No hay conexión con el servidor");
  }

  const json = await respuesta.json().catch(() => null);

  // sesion vencida: recarga completa al login para limpiar todo el estado
  if (respuesta.status === 401 && !ruta.includes("/auth/")) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- fuera de un componente no hay router
    window.location.href = "/login";
  }
  if (!json || !json.ok) {
    const error = json?.error;
    throw new ErrorCliente(respuesta.status, error?.codigo || "error", error?.mensaje || "Error inesperado", error?.detalles || []);
  }
  return json.data as T;
}
