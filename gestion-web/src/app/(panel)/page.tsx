import type { Metadata } from "next";
import { VistaInicio } from "@/components/inicio/VistaInicio";

export const metadata: Metadata = { title: "Inicio" };

export default function InicioPage() {
  return <VistaInicio />;
}
