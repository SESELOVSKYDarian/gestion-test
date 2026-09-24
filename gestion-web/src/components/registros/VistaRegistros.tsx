"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { EstadoError } from "@/components/common/EstadoError";
import { EstadoVacio } from "@/components/common/EstadoVacio";
import { Paginacion } from "@/components/common/Paginacion";
import { useModo } from "@/components/modo/ContextoModo";
import { useConsulta } from "@/hooks/useConsulta";
import { useRegistros } from "@/hooks/useRegistros";
import { useEdicionRegistros } from "@/hooks/useEdicionRegistros";
import { motivoSoloLectura } from "@/lib/registros/motivo-solo-lectura";
import type { Columna } from "@/tipos/panel";
import { BarraRegistros } from "./BarraRegistros";
import { TablaRegistros } from "./TablaRegistros";
import { AvisoSoloLectura } from "./AvisoSoloLectura";
import { EditorRegistro } from "./EditorRegistro";
import { ConfirmarEliminar } from "./ConfirmarEliminar";

type Esquema = { esVista: boolean; clavePrimaria: string[]; columnas: Columna[]; expuesta: boolean; permiteEscritura: boolean };

export function VistaRegistros({ tabla }: { tabla: string }) {
  const { estado } = useModo();
  const esquema = useConsulta<Esquema>("/api/panel/tablas/esquema", { tabla });
  const registros = useRegistros(tabla);
  const clavePrimaria = esquema.datos?.clavePrimaria || [];
  const edicion = useEdicionRegistros(tabla, clavePrimaria, registros.recargar);

  const motivo = esquema.datos ? motivoSoloLectura({ modo: estado.modo, ...esquema.datos }) : null;
  const editable = Boolean(esquema.datos) && motivo === null;
  const listado = registros.datos;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/tablas" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Tablas
      </Link>
      <EncabezadoPagina titulo={tabla} descripcion={listado ? `${listado.columnas.length} columnas · clave: ${clavePrimaria.join(", ") || "ninguna"}` : undefined}>
        {esquema.datos ? (
          <Badge variant="outline">{esquema.datos.expuesta ? "Expuesta en la API" : "No expuesta en la API"}</Badge>
        ) : null}
      </EncabezadoPagina>

      {motivo ? <AvisoSoloLectura motivo={motivo} /> : null}
      <BarraRegistros texto={registros.texto} editable={editable} alBuscar={registros.buscar} alCrear={edicion.abrirNuevo} />

      {esquema.error || registros.error ? (
        <EstadoError mensaje={esquema.error || registros.error || ""} alReintentar={registros.recargar} />
      ) : null}
      {!listado && !registros.error ? <Skeleton className="h-96 w-full" /> : null}
      {listado && listado.filas.length === 0 ? (
        <EstadoVacio titulo="Sin registros" texto={registros.texto ? "Ninguna fila coincide con la búsqueda." : "La tabla está vacía."} />
      ) : null}

      {listado && listado.filas.length > 0 ? (
        <>
          <TablaRegistros
            columnas={listado.columnas}
            clavePrimaria={listado.clavePrimaria}
            filas={listado.filas}
            orden={registros.orden}
            editable={editable}
            cargando={registros.cargando}
            alOrdenar={registros.ordenarPor}
            alEditar={edicion.abrirEdicion}
            alEliminar={edicion.pedirBorrado}
          />
          <Paginacion
            pagina={registros.pagina}
            porPagina={registros.porPagina}
            total={listado.total}
            alCambiarPagina={registros.setPagina}
            alCambiarPorPagina={registros.cambiarPorPagina}
          />
        </>
      ) : null}

      {esquema.datos ? (
        <EditorRegistro
          abierto={edicion.editorAbierto}
          tabla={tabla}
          columnas={esquema.datos.columnas}
          clavePrimaria={clavePrimaria}
          fila={edicion.filaEditada}
          alCerrar={edicion.cerrarEditor}
          alGuardar={edicion.guardado}
        />
      ) : null}
      <ConfirmarEliminar descripcion={edicion.descripcionBorrado} alCerrar={edicion.cancelarBorrado} alConfirmar={edicion.confirmarBorrado} />
    </div>
  );
}
