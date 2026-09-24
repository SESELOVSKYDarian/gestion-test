import { z } from "zod";
import { crearRuta } from "@/lib/http/crear-ruta";
import { listarClaves } from "@/services/claves/gestionar";

export const POST = crearRuta({
  origen: "panel",
  esquema: z.object({}),
  ejecutar: () => listarClaves(),
});
