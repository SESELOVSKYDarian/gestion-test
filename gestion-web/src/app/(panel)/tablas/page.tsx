import type { Metadata } from "next";
import { VistaTablas } from "@/components/tablas/VistaTablas";

export const metadata: Metadata = { title: "Tablas" };

export default function TablasPage() {
  return <VistaTablas />;
}
