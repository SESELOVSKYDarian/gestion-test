import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaCrear } from "@/validacion/registros";
import { operarCrear } from "@/services/registros/operaciones";

export const POST = crearRuta({
  origen: "panel",
  accion: "crear",
  esquema: esquemaCrear,
  ejecutar: operarCrear,
});
