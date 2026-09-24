// se ejecuta una vez al arrancar el servidor
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  // durante "next build" no hay base: la migracion corre al arrancar el contenedor
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { migrarPanel } = await import("./lib/db/migrar");
  await migrarPanel();
}
