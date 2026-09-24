import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaBuscar } from "@/validacion/registros";
import { operarBuscar } from "@/services/registros/operaciones";

export const POST = crearRuta({
  origen: "api",
  accion: "buscar",
  esquema: esquemaBuscar,
  ejecutar: operarBuscar,
});
