import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaListarTablas } from "@/validacion/panel";
import { listarTablas } from "@/services/esquema/listar-tablas";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaListarTablas,
  ejecutar: (_actor, cuerpo) => listarTablas({ soloExpuestas: false, forzar: cuerpo.refrescar }),
});
