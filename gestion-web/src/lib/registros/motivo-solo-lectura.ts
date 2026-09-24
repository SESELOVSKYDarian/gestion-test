type Datos = { modo: "lectura" | "escritura"; permiteEscritura: boolean; esVista: boolean; clavePrimaria: string[] };

// devuelve por que la tabla no se puede editar, o null si se puede
export function motivoSoloLectura({ modo, permiteEscritura, esVista, clavePrimaria }: Datos): string | null {
  if (esVista) return "Es una vista: solo se puede consultar.";
  if (clavePrimaria.length === 0) return "La tabla no tiene clave primaria, así que no se puede editar registro por registro.";
  if (modo !== "escritura") return "La API está en modo solo lectura.";
  if (!permiteEscritura) return "Esta tabla no tiene la escritura habilitada.";
  return null;
}
