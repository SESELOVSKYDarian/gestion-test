import { z } from "zod";
import { crearRuta } from "@/lib/http/crear-ruta";
import { obtenerModo } from "@/services/modo/modo";

export const POST = crearRuta({
  origen: "panel",
  esquema: z.object({}),
  ejecutar: () => obtenerModo(),
});
