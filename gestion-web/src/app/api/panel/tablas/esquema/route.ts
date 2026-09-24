import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaTabla } from "@/validacion/registros";
import { describirTabla } from "@/services/esquema/describir-tabla";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaTabla,
  ejecutar: (actor, cuerpo) => describirTabla(actor, cuerpo.tabla),
});
