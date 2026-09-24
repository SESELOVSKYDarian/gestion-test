"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function BotonCopiar({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      toast.error("No se pudo copiar: seleccioná el texto y copialo a mano");
    }
  }

  return (
    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Copiar ${etiqueta}`} onClick={copiar}>
      {copiado ? <Check className="text-exito" /> : <Copy />}
    </Button>
  );
}
