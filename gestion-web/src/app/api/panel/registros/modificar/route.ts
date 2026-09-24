import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaModificar } from "@/validacion/registros";
import { operarModificar } from "@/services/registros/operaciones";

export const POST = crearRuta({
  origen: "panel",
  accion: "modificar",
  esquema: esquemaModificar,
  ejecutar: operarModificar,
});
