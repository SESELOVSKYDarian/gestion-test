import type { Metadata } from "next";
import { VistaClaves } from "@/components/claves/VistaClaves";

export const metadata: Metadata = { title: "Claves de API" };

export default function ClavesPage() {
  return <VistaClaves />;
}
