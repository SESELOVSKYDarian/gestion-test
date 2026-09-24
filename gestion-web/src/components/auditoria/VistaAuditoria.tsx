"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EncabezadoPagina } from "@/components/common/EncabezadoPagina";
import { EstadoError } from "@/components/common/EstadoError";
import { EstadoVacio } from "@/components/common/EstadoVacio";
import { Paginacion } from "@/components/common/Paginacion";
import { useConsulta } from "@/hooks/useConsulta";
import { useDemora } from "@/hooks/useDemora";
import type { EventoAuditoria } from "@/tipos/panel";
import { FiltrosAuditoria } from "./FiltrosAuditoria";
import { TablaAuditoria } from "./TablaAuditoria";

const POR_PAGINA = 30;

export function VistaAuditoria() {
  const [pagina, setPagina] = useState(1);
  const [accion, setAccion] = useState("");
  const [tabla, setTabla] = useState("");
  const tablaDemorada = useDemora(tabla.trim());

  const cuerpo = { pagina, porPagina: POR_PAGINA, ...(accion ? { accion } : {}), ...(tablaDemorada ? { tabla: tablaDemorada } : {}) };
  const { datos, cargando, error, recargar } = useConsulta<{ eventos: EventoAuditoria[]; total: number }>("/api/panel/auditoria/listar", cuerpo);

  return (
    <div className="flex flex-col gap-6">
      <EncabezadoPagina titulo="Auditoría" descripcion="Cada pedido a la API y cada cambio hecho desde el panel, con su resultado.">
        <Button variant="outline" onClick={recargar} disabled={cargando}>
          <RefreshCw className={cargando ? "animate-spin" : undefined} /> Actualizar
        </Button>
      </EncabezadoPagina>

      <FiltrosAuditoria
        accion={accion}
        tabla={tabla}
        alCambiarAccion={(valor) => { setAccion(valor); setPagina(1); }}
        alCambiarTabla={(valor) => { setTabla(valor); setPagina(1); }}
      />

      {error ? <EstadoError mensaje={error} alReintentar={recargar} /> : null}
      {!datos && !error ? <Skeleton className="h-96 w-full" /> : null}
      {datos && datos.eventos.length === 0 ? <EstadoVacio titulo="Sin eventos" texto="No hay registros con esos filtros." /> : null}
      {datos && datos.eventos.length > 0 ? (
        <>
          <TablaAuditoria eventos={datos.eventos} cargando={cargando} />
          <Paginacion pagina={pagina} porPagina={POR_PAGINA} total={datos.total} alCambiarPagina={setPagina} />
        </>
      ) : null}
    </div>
  );
}
