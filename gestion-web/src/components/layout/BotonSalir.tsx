"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { llamarApi } from "@/lib/cliente/llamar-api";

export function BotonSalir() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function salir() {
    setSaliendo(true);
    await llamarApi("/api/panel/auth/logout").catch(() => null);
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={salir} disabled={saliendo}>
      <LogOut />
    </Button>
  );
}
