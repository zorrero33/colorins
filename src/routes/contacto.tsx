import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { business } from "@/lib/colorins-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contacto")({
  component: ContactPage,
});

function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensaje enviado correctamente. Le responderemos pronto.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-extrabold">Contacta con nosotros</h1>
          <p className="mt-6 text-xl text-muted-foreground">
            ¿Tienes dudas sobre un libro o necesitas material escolar específico? Estamos aquí para ayudarte.
          </p>

          <div className="mt-10 space-y-8">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-coral/10 flex items-center justify-center shrink-0">
                <MapPin className="text-coral" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Dirección</h3>
                <p className="text-muted-foreground">{business.street}, {business.postalCode} {business.city}</p>
              </div>
            </div>
            {/* Los siguientes campos mostrarán "Información pendiente" según las reglas si no se configuran en el admin */}
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-turquoise/10 flex items-center justify-center shrink-0">
                <Phone className="text-turquoise" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Teléfono</h3>
                <p className="text-muted-foreground">{business.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold">Nombre</label>
              <Input placeholder="Tu nombre" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Email</label>
              <Input type="email" placeholder="tu@email.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Asunto</label>
            <Input placeholder="¿En qué podemos ayudarte?" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Mensaje</label>
            <Textarea placeholder="Escribe tu consulta aquí..." className="min-h-[150px]" required />
          </div>
          <Button type="submit" className="w-full h-12 rounded-full font-bold text-lg">
            <Send className="mr-2 size-4" /> Enviar mensaje
          </Button>
        </form>
      </div>
    </div>
  );
}