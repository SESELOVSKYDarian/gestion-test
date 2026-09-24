# Conexión con el sistema de gestión viejo

La API **va a buscar** los datos a la base del sistema viejo. El programa viejo no se modifica y no hace falta
instalarle nada nuestro. Lo que sí hace falta es que el servidor de Easypanel llegue a la base.

## 1. MariaDB — conexión directa

1. **Red.** Instalar [Tailscale](https://tailscale.com) (o WireGuard) en el VPS de Easypanel y en el servidor donde
   corre MariaDB. La IP de la VPN (100.x.x.x) va en `LEGACY_DB_HOST`.
   - Alternativa: abrir el 3306 en el firewall **solo** para la IP del VPS. Nunca abrirlo a todo internet.
2. **MariaDB escuchando en la VPN.** En `my.cnf` / `my.ini`: `bind-address = 0.0.0.0` (o la IP de la VPN) y reiniciar.
3. **Usuarios.** Correr [`db/legacy/crear-usuarios.sql`](../db/legacy/crear-usuarios.sql) cambiando nombre de base,
   IP y contraseñas:
   - `gw_lectura`: solo `SELECT`. Lo usa la API para todo lo que es lectura.
   - `gw_escritura`: `SELECT, INSERT, UPDATE, DELETE`. Solo se usa cuando el panel está en *Lectura y escritura*.
   Aunque el panel tuviera un error, el usuario de lectura no puede escribir: son dos capas de protección.
4. **Probar.** En el panel, *Inicio → Conexiones* tiene que mostrar las dos conexiones en verde.

## 2. Access — tablas vinculadas (recomendado)

Access es un archivo (`.mdb` / `.accdb`), no un servidor: no escucha en ningún puerto y su driver solo existe para
Windows. Desde el contenedor Linux **no se puede leer en vivo**.

La solución sin programa extra: **mover los datos a MariaDB y dejar el Access usándolos como tablas vinculadas.**
El programa viejo sigue funcionando igual (formularios, informes, macros) y la API ve todo en MariaDB.

1. **Backup** del `.mdb`/`.accdb`. Probar primero en una copia.
2. Instalar **MariaDB Connector/ODBC** en la PC con Windows (misma arquitectura que Office: 32 o 64 bits).
3. Crear un **DSN** de sistema (`odbcad32`) apuntando al MariaDB.
4. En Access: *Datos externos → Más → Base de datos ODBC → Exportar* cada tabla al DSN (o usar la herramienta
   *MySQL Workbench → Migration Wizard*, que copia todas las tablas juntas).
5. Revisar en MariaDB que cada tabla tenga **clave primaria** (sin clave la API solo puede leerla).
6. En Access: renombrar las tablas locales (ej. `clientes_viejo`), después *Datos externos → ODBC → Vincular* las
   tablas de MariaDB **con el mismo nombre** que tenían. Formularios y consultas siguen andando.
7. Probar el programa viejo completo antes de borrar las tablas locales renombradas.

### Si no se puede tocar el Access

| Opción | Escritura | Nota |
|---|---|---|
| Agente chico en la PC Windows que lee el Access y lo sincroniza a MariaDB | Sí | Es un programa más para mantener |
| Copiar el archivo cada X minutos y leerlo con `mdbtools` | No | Datos atrasados, solo lectura |

## 3. ¿Y las claves pública y privada?

No las necesita el sistema viejo: la API es la que se conecta a su base. Las claves (*Claves de API* en el panel)
son para **otros sistemas que consuman la API** (tienda online, app, reportes). Cada uno recibe:

- `x-api-key`: clave pública (identifica quién llama).
- `Authorization: Bearer ...`: clave privada (se muestra una sola vez; en la base queda solo su hash).

## Riesgo a tener en cuenta

Escribir directo en las tablas saltea las reglas que aplica el programa viejo (stock, numeración de comprobantes,
campos calculados). Por eso todo arranca en **solo lectura**, la escritura se habilita **tabla por tabla** y cada
cambio queda en **Auditoría**.
