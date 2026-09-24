import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/auth/sesion";
import { obtenerModo } from "@/services/modo/modo";
import { ProveedorModo } from "@/components/modo/ContextoModo";
import { BarraLateral } from "@/components/layout/BarraLateral";
import { BarraMovil } from "@/components/layout/BarraMovil";
import { BotonSubir } from "@/components/layout/BotonSubir";
import { PanelSinBase } from "@/components/layout/PanelSinBase";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sesion = await obtenerSesion();
  if (!sesion) redirect("/login");

  // si la base del panel no responde, lo aviso en vez de romper
  const modo = await obtenerModo().catch(() => null);
  if (!modo) return <PanelSinBase />;

  return (
    <ProveedorModo inicial={modo}>
      <div className="flex min-h-dvh">
        <BarraLateral nombre={sesion.nombre} email={sesion.email} />
        <div className="flex min-w-0 flex-1 flex-col">
          <BarraMovil nombre={sesion.nombre} email={sesion.email} />
          <main className="mx-auto w-full max-w-[1400px] flex-1 px-gutter py-section">{children}</main>
        </div>
      </div>
      <BotonSubir />
    </ProveedorModo>
  );
}
