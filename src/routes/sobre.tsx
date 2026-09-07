import { createFileRoute } from "@tanstack/react-router";
import { business } from "@/lib/colorins-data";
import { Sparkles, Heart, Users, BookOpen } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-display text-5xl font-extrabold leading-tight">Mucho más que una librería en el corazón de <span className="text-turquoise">Onda</span></h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          En COLORINS creemos que la creatividad no tiene límites. Desde nuestra tienda junto al CEIP Pío XII, acompañamos a familias, estudiantes y mentes creativas en su día a día.
        </p>
      </div>

      <div className="grid gap-8 mt-20 md:grid-cols-3">
        {[
          { icon: <Heart className="text-coral" />, title: "Cercanía", desc: "Atención personalizada para encontrar exactamente lo que necesitas." },
          { icon: <BookOpen className="text-turquoise" />, title: "Cultura", desc: "Fomentamos la lectura y el arte en nuestra comunidad local." },
          { icon: <Sparkles className="text-sun" />, title: "Creatividad", desc: "Seleccionamos los mejores materiales para tus proyectos y regalos." }
        ].map((item, i) => (
          <div key={i} className="surface-card p-8 text-center">
            <div className="size-14 bg-background rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">{item.icon}</div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="mt-2 text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-24 p-12 bg-cream rounded-[3rem] border border-border">
        <h2 className="font-display text-3xl font-bold">Nuestra Ubicación</h2>
        <p className="mt-4 text-lg">Nos encontrarás en <strong>{business.street}</strong>, un espacio diseñado para inspirarte.</p>
        <p className="mt-2 text-muted-foreground">Información sobre la historia de la empresa pendiente de configurar por el propietario.</p>
      </section>
    </div>
  );
}