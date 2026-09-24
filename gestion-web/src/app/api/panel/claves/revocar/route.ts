import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaId } from "@/validacion/panel";
import { revocarClave } from "@/services/claves/gestionar";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaId,
  ejecutar: (_actor, cuerpo) => revocarClave(cuerpo.id),
});
