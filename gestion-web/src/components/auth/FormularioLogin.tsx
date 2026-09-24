"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Campo } from "@/components/common/Campo";
import { EstadoError } from "@/components/common/EstadoError";
import { llamarApi } from "@/lib/cliente/llamar-api";

type Errores = { email?: string; password?: string };

function validar(email: string, password: string): Errores {
  const errores: Errores = {};
  if (!email.trim()) errores.email = "Ingresá tu email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.email = "El email no tiene un formato válido";
  if (!password) errores.password = "Ingresá tu contraseña";
  return errores;
}

export function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    const encontrados = validar(email, password);
    setErrores(encontrados);
    setErrorGeneral("");
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    try {
      await llamarApi("/api/panel/auth/login", { email: email.trim(), password });
      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorGeneral((error as Error).message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {errorGeneral ? <EstadoError mensaje={errorGeneral} /> : null}
      <Campo id="email" etiqueta="Email" error={errores.email}>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          required
          maxLength={160}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? "email-error" : undefined}
          className="h-10"
        />
      </Campo>
      <Campo id="password" etiqueta="Contraseña" error={errores.password}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={200}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errores.password)}
          aria-describedby={errores.password ? "password-error" : undefined}
          className="h-10"
        />
      </Campo>
      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? <Loader2 className="animate-spin" /> : null}
        {enviando ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
