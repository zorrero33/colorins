import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

/** PUNTO DE INTEGRACIÓN: enviar el alta a la API de suscriptores. */
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Introduce un correo electrónico válido.");
      return;
    }
    if (!consent) {
      toast.error("Debes aceptar la política de privacidad.");
      return;
    }
    setEmail("");
    setConsent(false);
    toast.success("Prototipo: el alta se registrará cuando se conecte el sistema de newsletter.");
  };

  return (
    <form onSubmit={submit} className={compact ? "mt-3 space-y-3" : "mt-6 space-y-3"}>
      {!compact && (
        <p className="text-muted-foreground">Recibe novedades, ofertas y actividades de Colorins.</p>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          aria-label="Correo electrónico"
          maxLength={255}
          className="bg-background"
        />
        <Button type="submit" className="shrink-0 rounded-full px-6">
          Suscribirme
        </Button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-label="Aceptar la política de privacidad" />
        <span>Acepto la política de privacidad y el tratamiento de mis datos.</span>
      </label>
    </form>
  );
}
