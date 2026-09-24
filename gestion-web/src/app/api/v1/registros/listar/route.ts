import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaListar } from "@/validacion/registros";
import { operarListar } from "@/services/registros/operaciones";

export const POST = crearRuta({
  origen: "api",
  accion: "listar",
  esquema: esquemaListar,
  ejecutar: operarListar,
});
