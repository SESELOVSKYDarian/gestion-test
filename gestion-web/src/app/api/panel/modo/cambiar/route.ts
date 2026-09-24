import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaModo } from "@/validacion/panel";
import { cambiarModo } from "@/services/modo/modo";
import { usuarioDe } from "@/services/usuarios/usuario-de";

export const POST = crearRuta({
  origen: "panel",
  accion: "modo",
  esquema: esquemaModo,
  ejecutar: (actor, cuerpo) => cambiarModo(cuerpo.modo, usuarioDe(actor)),
});
