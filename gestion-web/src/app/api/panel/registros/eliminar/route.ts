import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaEliminar } from "@/validacion/registros";
import { operarEliminar } from "@/services/registros/operaciones";

export const POST = crearRuta({
  origen: "panel",
  accion: "eliminar",
  esquema: esquemaEliminar,
  ejecutar: operarEliminar,
});
