import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const KEY = "colorins.cookies.v1";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);

  const save = (value: Record<string, boolean>) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-60 mx-auto max-w-3xl rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-lift)]">
      <h2 className="font-display text-lg font-bold">Cookies en Colorins</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Usamos cookies necesarias para el funcionamiento del sitio y, si lo autorizas, cookies de análisis.
        Texto informativo pendiente de revisión legal.{" "}
        <Link to="/sobre" className="underline">
          Política de cookies
        </Link>
      </p>
      {prefs && (
        <div className="mt-4 space-y-3 rounded-2xl bg-muted p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span>Necesarias (siempre activas)</span>
            <Switch checked disabled aria-label="Cookies necesarias" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Analíticas</span>
            <Switch checked={analytics} onCheckedChange={setAnalytics} aria-label="Cookies analíticas" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>Marketing</span>
            <Switch checked={marketing} onCheckedChange={setMarketing} aria-label="Cookies de marketing" />
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => save({ analytics: true, marketing: true })} className="rounded-full">
          Aceptar todas
        </Button>
        <Button variant="secondary" className="rounded-full" onClick={() => save({ analytics: false, marketing: false })}>
          Solo necesarias
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={() => (prefs ? save({ analytics, marketing }) : setPrefs(true))}>
          {prefs ? "Guardar preferencias" : "Configurar"}
        </Button>
      </div>
    </div>
  );
}
