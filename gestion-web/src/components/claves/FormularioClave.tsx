"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Campo } from "@/components/common/Campo";
import { EstadoError } from "@/components/common/EstadoError";
import { llamarApi } from "@/lib/cliente/llamar-api";

export type ClaveCreada = { nombre: string; clavePublica: string; secreto: string };

function validarNombre(nombre: string) {
  const limpio = nombre.trim();
  if (limpio.length < 3) return "Mínimo 3 caracteres";
  if (limpio.length > 80) return "Máximo 80 caracteres";
  if (!/^[\p{L}0-9 _.-]+$/u.test(limpio)) return "Solo letras, números, espacios, punto, guion y guion bajo";
  return "";
}

export function FormularioClave({ alCrear }: { alCrear: (clave: ClaveCreada) => void }) {
  const [nombre, setNombre] = useState("");
  const [permiso, setPermiso] = useState<"lectura" | "escritura">("lectura");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const error = validarNombre(nombre);
    setErrorNombre(error);
    if (error) return;
    setEnviando(true);
    try {
      alCrear(await llamarApi<ClaveCreada>("/api/panel/claves/crear", { nombre: nombre.trim(), permiso }));
    } catch (e) {
      setErrorGeneral((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {errorGeneral ? <EstadoError mensaje={errorGeneral} /> : null}
      <Campo id="nombre-clave" etiqueta="Nombre" error={errorNombre} ayuda="Para saber quién la usa. Ej: Integración tienda online">
        <Input
          id="nombre-clave"
          required
          minLength={3}
          maxLength={80}
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            if (errorNombre) setErrorNombre(validarNombre(e.target.value));
          }}
          aria-invalid={Boolean(errorNombre)}
        />
      </Campo>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Permiso</legend>
        {(["lectura", "escritura"] as const).map((opcion) => (
          <label key={opcion} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2.5 has-checked:border-foreground/30 has-checked:bg-muted/50">
            <input type="radio" name="permiso" value={opcion} checked={permiso === opcion} onChange={() => setPermiso(opcion)} className="mt-1 accent-current" />
            <span className="text-sm">
              {opcion === "lectura" ? "Solo lectura" : "Lectura y escritura"}
              <span className="block text-xs text-muted-foreground">
                {opcion === "lectura" ? "Listar, buscar y ver estructura." : "Además crea, modifica y borra cuando la API está en modo escritura."}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      <Button type="submit" disabled={enviando}>
        {enviando ? <Loader2 className="animate-spin" /> : null}
        Generar clave
      </Button>
    </form>
  );
}
