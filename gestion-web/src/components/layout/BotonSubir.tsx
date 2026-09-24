"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// aparece despues de bajar 480px y sube con scroll suave
export function BotonSubir() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function revisar() {
      setVisible(window.scrollY > 480);
    }
    revisar();
    window.addEventListener("scroll", revisar, { passive: true });
    return () => window.removeEventListener("scroll", revisar);
  }, []);

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Volver arriba"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0 })}
      className={cn(
        "fixed right-5 bottom-5 z-40 rounded-full shadow-lg transition-[opacity,transform] duration-200 ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUp />
    </Button>
  );
}
