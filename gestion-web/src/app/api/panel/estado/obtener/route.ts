import { z } from "zod";
import { crearRuta } from "@/lib/http/crear-ruta";
import { obtenerEstado } from "@/services/estado/obtener-estado";

export const POST = crearRuta({
  origen: "panel",
  esquema: z.object({}),
  ejecutar: () => obtenerEstado(),
});
