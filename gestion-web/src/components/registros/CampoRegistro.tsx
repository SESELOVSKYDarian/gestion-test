"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Campo } from "@/components/common/Campo";
import { opcionesEnum, tipoControl } from "@/lib/registros/tipo-control";
import type { Columna } from "@/tipos/panel";

type Props = {
  columna: Columna;
  valor: string;
  error?: string;
  soloLectura: boolean;
  alCambiar: (valor: string) => void;
};

const claseSelect =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30";

function ayudaDe(columna: Columna, soloLectura: boolean) {
  if (soloLectura) return "Clave primaria: no se modifica";
  if (columna.autoIncremental) return "Se genera sola si la dejás vacía";
  return columna.aceptaNulo ? `${columna.tipoCompleto} · opcional` : columna.tipoCompleto;
}

function textoVacio(columna: Columna) {
  if (columna.aceptaNulo) return "— vacío —";
  if (columna.tieneDefecto) return "— valor por defecto —";
  return "Elegí una opción";
}

// un campo del formulario, segun el tipo real de la columna
export function CampoRegistro({ columna, valor, error, soloLectura, alCambiar }: Props) {
  const id = `campo-${columna.nombre}`;
  const control = tipoControl(columna);
  const comunes = {
    id,
    value: valor,
    disabled: soloLectura,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  function renderControl() {
    if (control === "booleano" || control === "opciones") {
      const opciones = control === "booleano" ? [["1", "Sí (1)"], ["0", "No (0)"]] : opcionesEnum(columna).map((o) => [o, o]);
      return (
        <select {...comunes} onChange={(e) => alCambiar(e.target.value)} className={claseSelect}>
          <option value="">{textoVacio(columna)}</option>
          {opciones.map(([valorOpcion, texto]) => (
            <option key={valorOpcion} value={valorOpcion}>{texto}</option>
          ))}
        </select>
      );
    }
    if (control === "textoLargo") return <Textarea {...comunes} rows={3} onChange={(e) => alCambiar(e.target.value)} />;
    if (control === "noEditable") return <Input {...comunes} disabled value="(tipo no editable desde el panel)" />;

    const tipos = { fecha: "date", fechaHora: "datetime-local", hora: "time" } as Record<string, string>;
    return (
      <Input
        {...comunes}
        type={tipos[control] || "text"}
        step={control === "fechaHora" || control === "hora" ? 1 : undefined}
        inputMode={control === "entero" ? "numeric" : control === "decimal" ? "decimal" : undefined}
        maxLength={columna.largoMaximo ?? undefined}
        onChange={(e) => alCambiar(e.target.value)}
        className={control === "entero" || control === "decimal" ? "tabular" : undefined}
      />
    );
  }

  return (
    <Campo id={id} etiqueta={columna.nombre} error={error} ayuda={ayudaDe(columna, soloLectura)}>
      {renderControl()}
    </Campo>
  );
}
