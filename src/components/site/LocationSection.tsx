import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/lib/shop";

export function LocationSection() {
  const { settings } = useShop();
  const b = settings.business;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`;

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 lg:px-8" aria-labelledby="ubicacion">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 id="ubicacion" className="font-display text-3xl font-extrabold sm:text-4xl">
            Encuéntranos en Onda
          </h2>
          <address className="mt-5 space-y-1 text-base not-italic">
            <p className="font-display text-xl font-bold">{b.name}</p>
            <p>{b.street}</p>
            <p>
              {b.postalCode} {b.city}, {b.province}
            </p>
            <p className="text-muted-foreground">
              {b.region}, {b.country}
            </p>
          </address>
          <p className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sun/25 px-4 py-2 text-sm font-semibold text-sun-foreground">
            <MapPin className="size-4" /> La tienda se encuentra muy cerca del CEIP Pío XII
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full px-6">
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                <Navigation className="size-4" /> Cómo llegar
              </a>
            </Button>
            <Button variant="secondary" className="rounded-full px-6" disabled title="Teléfono pendiente de configurar">
              <Phone className="size-4" /> Llamar
            </Button>
          </div>

          <div className="surface-card mt-8 p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <Clock className="size-4 text-turquoise" /> Horario
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Horario editable desde el panel de administración. Todavía no configurado.
            </p>
            <dl className="mt-4 divide-y divide-border text-sm">
              {settings.hours.map((h) => (
                <div key={h.day} className="flex items-center justify-between gap-4 py-2">
                  <dt className="font-medium">{h.day}</dt>
                  <dd className="text-muted-foreground">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-border bg-muted shadow-[var(--shadow-soft)]">
          <iframe
            title="Mapa de la ubicación de Colorins en Onda"
            src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&output=embed`}
            className="h-full min-h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
