import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { ProveedorTema } from "@/components/layout/ProveedorTema";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// nombres de variable distintos a los del @theme (si no, se autorreferencian)
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const text = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-text", display: "swap" });
const code = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-code", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Gestión Web", template: "%s · Gestión Web" },
  description: "Panel para exponer la base del sistema de gestión como API, en modo lectura o lectura y escritura.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${text.variable} ${code.variable} antialiased`}>
      <body className="min-h-dvh">
        <ProveedorTema>
          {children}
          <Toaster position="bottom-right" />
        </ProveedorTema>
      </body>
    </html>
  );
}
