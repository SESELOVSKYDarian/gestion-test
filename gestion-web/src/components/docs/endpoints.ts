// referencia de la API publica: lo que muestra la pagina de documentacion
export type Endpoint = {
  ruta: string;
  descripcion: string;
  escribe: boolean;
  cuerpo: object;
  respuesta: object;
};

export const ENDPOINTS: Endpoint[] = [
  {
    ruta: "/api/v1/tablas/listar",
    descripcion: "Tablas expuestas y si aceptan escritura.",
    escribe: false,
    cuerpo: {},
    respuesta: { ok: true, data: [{ nombre: "clientes", clavePrimaria: ["id_cliente"], permiteEscritura: true }] },
  },
  {
    ruta: "/api/v1/tablas/esquema",
    descripcion: "Columnas, tipos y clave primaria de una tabla.",
    escribe: false,
    cuerpo: { tabla: "clientes" },
    respuesta: { ok: true, data: { nombre: "clientes", clavePrimaria: ["id_cliente"], columnas: ["…"] } },
  },
  {
    ruta: "/api/v1/registros/listar",
    descripcion: "Registros paginados. Filtros exactos por columna, búsqueda de texto y orden.",
    escribe: false,
    cuerpo: { tabla: "clientes", pagina: 1, porPagina: 25, texto: "sur", filtros: { activo: 1 }, orden: { columna: "razon_social", direccion: "asc" } },
    respuesta: { ok: true, data: { filas: ["…"], total: 1, pagina: 1, porPagina: 25 } },
  },
  {
    ruta: "/api/v1/registros/buscar",
    descripcion: "Un registro por su clave primaria (todas las columnas de la clave).",
    escribe: false,
    cuerpo: { tabla: "clientes", id: { id_cliente: 1 } },
    respuesta: { ok: true, data: { id_cliente: 1, razon_social: "Construcciones del Sur SRL" } },
  },
  {
    ruta: "/api/v1/registros/crear",
    descripcion: "Inserta un registro. Devuelve el id y la fila creada.",
    escribe: true,
    cuerpo: { tabla: "clientes", datos: { razon_social: "Nuevo SA", cuit: "30-12345678-9", id_provincia: 1, fecha_alta: "2026-09-24" } },
    respuesta: { ok: true, data: { id: { id_cliente: 6 }, registro: { "…": "…" } } },
  },
  {
    ruta: "/api/v1/registros/modificar",
    descripcion: "Actualiza solo los campos enviados. La clave primaria no se puede cambiar.",
    escribe: true,
    cuerpo: { tabla: "clientes", id: { id_cliente: 6 }, datos: { telefono: "011 5555-0000" } },
    respuesta: { ok: true, data: { id: { id_cliente: 6 }, registro: { "…": "…" } } },
  },
  {
    ruta: "/api/v1/registros/eliminar",
    descripcion: "Borra un registro. Falla con 409 si otros registros dependen de él.",
    escribe: true,
    cuerpo: { tabla: "clientes", id: { id_cliente: 6 } },
    respuesta: { ok: true, data: { id: { id_cliente: 6 }, eliminado: true } },
  },
];

export const ERRORES = [
  { estado: 400, codigo: "datos_invalidos", texto: "El cuerpo no cumple el formato. En detalles viene campo por campo." },
  { estado: 401, codigo: "credenciales_invalidas", texto: "Falta la clave, es incorrecta o fue revocada." },
  { estado: 403, codigo: "modo_lectura", texto: "La API está en solo lectura (se cambia desde el panel)." },
  { estado: 403, codigo: "clave_solo_lectura", texto: "La clave no tiene permiso de escritura." },
  { estado: 403, codigo: "tabla_solo_lectura", texto: "La tabla no tiene la escritura habilitada." },
  { estado: 404, codigo: "tabla_inexistente", texto: "La tabla no existe o no está expuesta." },
  { estado: 409, codigo: "duplicado / registro_en_uso", texto: "Conflicto con un valor único o con registros relacionados." },
  { estado: 429, codigo: "demasiados_pedidos", texto: "Más de 120 pedidos por minuto con la misma clave." },
];
