import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaNuevaClave } from "@/validacion/panel";
import { crearClave } from "@/services/claves/gestionar";
import { usuarioDe } from "@/services/usuarios/usuario-de";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaNuevaClave,
  ejecutar: (actor, cuerpo) => crearClave({ ...cuerpo, usuarioId: usuarioDe(actor) }),
});
