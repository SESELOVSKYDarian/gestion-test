import type { Metadata } from "next";
import { VistaAuditoria } from "@/components/auditoria/VistaAuditoria";

export const metadata: Metadata = { title: "Auditoría" };

export default function AuditoriaPage() {
  return <VistaAuditoria />;
}
