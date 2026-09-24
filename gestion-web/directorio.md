# Gestión Web — directorio

Panel (Next.js 16 + shadcn/ui) que expone la base del sistema de gestión viejo como API, con modo
**solo lectura** o **lectura y escritura** elegido desde el panel. Todos los endpoints son **POST**.

## Arrancar

```bash
cp .env.example .env.local   # completar valores
npm install
npm run dev                  # http://localhost:3000
```

Datos de prueba locales: `db/demo/legacy-demo.sql` crea una base `legacy_demo` que imita al sistema viejo.
Las tablas del panel se crean solas al arrancar (`src/instrumentation.ts`).

## Deploy en Easypanel

1. Crear un servicio **MariaDB** (base del panel). Sus datos van en `PANEL_DB_*`.
2. Crear un servicio **App** desde el repo con *Build: Dockerfile* y *Build path* `/gestion-web`. Puerto `3000`.
3. Cargar las variables de `.env.example` en *Environment*.
4. Conectar el VPS con el sistema viejo por VPN: ver `docs/conexion-sistema-viejo.md`.

## Carpetas

```text
gestion-web/
├── Dockerfile, .dockerignore     imagen de producción (salida standalone)
├── .env.example                  todas las variables explicadas
├── db/
│   ├── demo/legacy-demo.sql      base de ejemplo para desarrollo
│   └── legacy/crear-usuarios.sql usuarios gw_lectura / gw_escritura para el MariaDB real
├── docs/conexion-sistema-viejo.md MariaDB por VPN, Access con tablas vinculadas, claves
└── src/
    ├── instrumentation.ts        al arrancar: crea tablas del panel + admin inicial
    ├── app/
    │   ├── layout.tsx, globals.css   fuentes, tema, tokens de color (OKLCH)
    │   ├── login/                    pantalla de ingreso
    │   ├── (panel)/                  pantallas con sesión (layout con barra lateral)
    │   │   ├── page.tsx              Inicio: modo, cifras, conexiones, actividad
    │   │   ├── tablas/               lista de tablas y explorador [tabla]
    │   │   ├── claves/               claves de API
    │   │   ├── auditoria/            historial de pedidos
    │   │   └── documentacion/        referencia de la API
    │   └── api/
    │       ├── v1/                   API pública (clave pública + privada)
    │       └── panel/                API interna que consume el panel (cookie de sesión)
    ├── lib/
    │   ├── db/                       pools MariaDB (panel y sistema viejo), esquema y migración
    │   ├── auth/                     sesión JWT, generación y verificación de claves
    │   ├── http/                     crear-ruta (auth + validación + auditoría), respuestas, errores
    │   ├── sql/citar.ts              escape de nombres de tabla/columna
    │   ├── registros/                lógica del formulario de registros (frontend)
    │   ├── cliente/llamar-api.ts     fetch POST del frontend
    │   └── formato.ts                fechas DD/MM/AA y números
    ├── services/                 lógica de negocio del backend
    │   ├── esquema/              lee information_schema, exposición de tablas
    │   ├── registros/            listar/buscar/crear/modificar/eliminar + permisos + validación
    │   ├── claves/               alta, revocación, autenticación, límite por minuto
    │   ├── modo/                 modo global lectura / escritura
    │   ├── auditoria/            registrar y listar eventos
    │   ├── estado/               datos de la pantalla de inicio
    │   └── usuarios/             login y límite de intentos
    ├── validacion/               esquemas zod (panel y registros)
    ├── hooks/                    useConsulta, useRegistros, useTablas, formularios
    ├── tipos/panel.ts            tipos compartidos del frontend
    └── components/
        ├── ui/                   componentes shadcn (radix, preset nova)
        ├── layout/               barra lateral, menú móvil, tema, subir arriba
        ├── modo/                 control y contexto del modo de la API
        ├── inicio/ tablas/ registros/ claves/ auditoria/ docs/   una carpeta por pantalla
        ├── auth/                 formulario de login
        └── common/               campo, paginación, estados vacío/error, copiar
```

## Dónde está cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Qué se permite escribir | `src/services/registros/permisos.ts` |
| Validación de valores por tipo | `src/services/registros/validar-valor.ts` |
| Tablas de la base del panel | `src/lib/db/esquema-panel.ts` |
| Límite de pedidos por clave | `src/services/claves/limitar-pedidos.ts` |
| Colores y tipografía | `src/app/globals.css`, `src/app/layout.tsx` |
| Menú lateral | `src/components/layout/enlaces.ts` |
| Documentación de endpoints | `src/components/docs/endpoints.ts` |

## Base del panel (3FN)

`niveles_acceso` (lectura/escritura) ← `configuracion_api` (fila única con el modo) y `api_claves` (permiso por
clave). `usuarios`, `tablas_expuestas` (una fila = tabla expuesta, con `permite_escritura`) y `auditoria`.
Una clave está activa si `revocada_en` es NULL (no se guarda un dato derivado).

## Seguridad

- Nombres de tabla/columna validados contra `information_schema` antes de usarlos; valores siempre como parámetros.
- Escribir exige 4 cosas: modo global escritura, clave con permiso de escritura, tabla habilitada y clave primaria.
- Dos usuarios de MariaDB en el sistema viejo: el de lectura no puede escribir aunque el código fallara.
- Secretos de claves guardados como SHA-256; contraseñas con bcrypt; sesión en cookie httpOnly.
- Límite de 120 pedidos/minuto por clave y 8 logins fallidos cada 15 min por IP (en memoria: una sola instancia).
