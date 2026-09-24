import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaConfigTabla } from "@/validacion/panel";
import { configurarTabla } from "@/services/esquema/configurar-tabla";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaConfigTabla,
  ejecutar: (_actor, cuerpo) => configurarTabla(cuerpo),
});
