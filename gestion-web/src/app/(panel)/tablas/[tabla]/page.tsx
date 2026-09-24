import type { Metadata } from "next";
import { VistaRegistros } from "@/components/registros/VistaRegistros";

type Props = { params: Promise<{ tabla: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tabla } = await params;
  return { title: decodeURIComponent(tabla) };
}

export default async function RegistrosPage({ params }: Props) {
  const { tabla } = await params;
  return <VistaRegistros tabla={decodeURIComponent(tabla)} />;
}
