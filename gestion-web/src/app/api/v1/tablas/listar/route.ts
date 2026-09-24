import { z } from "zod";
import { crearRuta } from "@/lib/http/crear-ruta";
import { listarTablas } from "@/services/esquema/listar-tablas";

// solo las tablas que el panel expuso
export const POST = crearRuta({
  origen: "api",
  accion: "tablas",
  esquema: z.object({}),
  ejecutar: async () => {
    const tablas = await listarTablas({ soloExpuestas: true });
    return tablas.map(({ nombre, clavePrimaria, permiteEscritura }) => ({ nombre, clavePrimaria, permiteEscritura }));
  },
});
