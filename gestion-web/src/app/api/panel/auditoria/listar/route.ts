import { crearRuta } from "@/lib/http/crear-ruta";
import { esquemaAuditoria } from "@/validacion/panel";
import { listarAuditoria } from "@/services/auditoria/listar";

export const POST = crearRuta({
  origen: "panel",
  esquema: esquemaAuditoria,
  ejecutar: (_actor, cuerpo) => listarAuditoria(cuerpo),
});
