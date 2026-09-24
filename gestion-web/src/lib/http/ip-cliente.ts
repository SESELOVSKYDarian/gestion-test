// ip del que llama (Easypanel pone un proxy adelante)
export function ipCliente(request: Request): string | null {
  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) return reenviada.split(",")[0].trim().slice(0, 45);
  return request.headers.get("x-real-ip");
}
