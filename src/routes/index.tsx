import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "../lib/colorins-data";
import { Button } from "../components/ui/button";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  ShoppingBag,
  Palette,
  Star,
  Navigation,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen overflow-hidden bg-background">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-coral/10 blur-3xl" />

          <div className="absolute right-[-10%] top-20 h-[550px] w-[550px] rounded-full bg-turquoise/10 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
          {/* HERO TEXT */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-coral">
              <Sparkles size={15} />
              Llibreria · Papereria · Onda
            </div>

            <h1 className="mb-7 max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.045em] text-[oklch(0.24_0.05_264)] sm:text-6xl lg:text-[5.2rem]">
              Un mundo lleno de{" "}
              <span className="text-gradient-brand">
                color y creatividad
              </span>
            </h1>

            <p className="mb-9 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Todo lo que necesitas para el cole, tus proyectos y tus momentos
              creativos en{" "}
              <strong className="text-foreground">Colorins Onda</strong>,
              justo enfrente del CEIP Pío XII.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-coral px-8 text-base font-extrabold text-white shadow-xl shadow-coral/25 transition-all hover:-translate-y-1 hover:bg-coral/90 hover:shadow-2xl hover:shadow-coral/30"
              >
                <Link to="/tienda">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Explorar tienda
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-2 border-turquoise bg-background/70 px-8 text-base font-extrabold text-turquoise backdrop-blur transition-all hover:-translate-y-1 hover:bg-turquoise hover:text-white"
              >
                <Link to="/cole">Listas escolares</Link>
              </Button>
            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                </span>
                Productos para todos
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-turquoise/10 text-turquoise">
                  <Palette size={16} />
                </span>
                Creatividad sin límites
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10 text-coral">
                  <MapPin size={16} />
                </span>
                En el corazón de Onda
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative lg:pl-4">
            {/* Decorative shapes */}
            <div className="absolute -right-8 -top-8 z-0 h-28 w-28 rotate-12 rounded-[2rem] bg-yellow-300 shadow-lg" />

            <div className="absolute -bottom-8 -left-8 z-0 h-32 w-32 -rotate-12 rounded-full bg-turquoise shadow-lg" />

            {/* Main image */}
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl shadow-black/15">
              <img
                src="/tienda-onda.png"
                alt="Tienda Colorins en Onda"
                className="aspect-[4/3] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />

              {/* Image gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Image information */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div className="rounded-2xl bg-white/95 px-5 py-3 shadow-xl backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ven a visitarnos
                  </p>

                  <p className="font-display text-lg font-black text-foreground">
                    Colorins · Onda
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral text-white shadow-xl">
                  <MapPin size={21} />
                </div>
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-7 -right-5 z-20 hidden rounded-2xl border border-white/70 bg-white/95 p-4 shadow-2xl backdrop-blur sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-turquoise/10 text-turquoise">
                  <Sparkles size={21} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Todo para
                  </p>

                  <p className="font-bold">
                    crear, estudiar y disfrutar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURE STRIP
      ========================================================= */}
      <section className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-xl sm:grid-cols-3">
          <div className="flex items-center gap-4 border-b border-border p-6 sm:border-b-0 sm:border-r">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-coral/10 text-coral">
              <ShoppingBag size={22} />
            </div>

            <div>
              <p className="font-bold">Todo en un solo lugar</p>

              <p className="text-sm text-muted-foreground">
                Cole, oficina y creatividad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-border p-6 sm:border-b-0 sm:border-r">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-turquoise/10 text-turquoise">
              <Palette size={22} />
            </div>

            <div>
              <p className="font-bold">Imagina. Crea. Disfruta.</p>

              <p className="text-sm text-muted-foreground">
                Material para dar vida a tus ideas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-500">
              <Star size={22} fill="currentColor" />
            </div>

            <div>
              <p className="font-bold">Estamos en Onda</p>

              <p className="text-sm text-muted-foreground">
                Cerca de ti y de tu cole
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CATEGORIES
      ========================================================= */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-sm font-extrabold uppercase tracking-[0.18em] text-coral">
              Explora
            </span>

            <h2 className="font-display text-4xl font-black tracking-tight text-[oklch(0.24_0.05_264)] sm:text-5xl">
              Todo empieza con una idea
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Encuentra inspiración y todo el material que necesitas para
              convertir tus ideas en algo increíble.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="group w-fit font-bold text-coral hover:bg-coral/10 hover:text-coral"
          >
            <Link to="/tienda">
              Ver todo
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {(categories || []).map((cat, index) => {
            const colors = [
              "bg-coral/10 group-hover:bg-coral text-coral",
              "bg-turquoise/10 group-hover:bg-turquoise text-turquoise",
              "bg-yellow-400/15 group-hover:bg-yellow-400 text-yellow-500",
              "bg-purple-500/10 group-hover:bg-purple-500 text-purple-500",
            ];

            return (
              <Link
                key={cat.slug}
                to="/tienda"
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl sm:p-8"
              >
                <div
                  className={`relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl transition-all duration-300 group-hover:scale-110 group-hover:text-white ${colors[index % colors.length]}`}
                >
                  <span role="img" aria-label={cat.name}>
                    {cat.emoji}
                  </span>
                </div>

                <h3 className="relative z-10 text-xl font-extrabold">
                  {cat.name}
                </h3>

                <div className="relative z-10 mt-4 flex items-center text-sm font-bold text-muted-foreground transition-colors group-hover:text-foreground">
                  Descubrir
                  <ArrowRight
                    size={16}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </div>

                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-muted/60 transition-transform duration-500 group-hover:scale-[2]" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[oklch(0.24_0.05_264)] px-6 py-14 text-white shadow-2xl sm:px-12 lg:px-20 lg:py-16">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-coral/30 blur-3xl" />

          <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-turquoise/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80">
                <Sparkles size={14} />
                Colorins Onda
              </span>

              <h2 className="font-display text-4xl font-black leading-tight sm:text-5xl">
                ¿Preparado para darle{" "}
                <span className="text-coral">color</span> a tus ideas?
              </h2>

              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/65">
                Explora nuestra tienda y encuentra todo lo necesario para
                estudiar, crear y disfrutar.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="group h-14 shrink-0 rounded-full bg-white px-8 text-base font-extrabold text-[oklch(0.24_0.05_264)] shadow-xl hover:bg-white/90"
            >
              <Link to="/tienda">
                Empezar a explorar
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          LOCATION / MAP
      ========================================================= */}
      <section className="relative px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-extrabold uppercase tracking-[0.18em] text-coral">
              Ven a visitarnos
            </span>

            <h2 className="font-display text-4xl font-black tracking-tight text-[oklch(0.24_0.05_264)] sm:text-5xl">
              Estamos en Onda 📍
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Nos encontrarás justo enfrente del CEIP Pío XII. Ven a
              conocernos y descubre todo lo que tenemos preparado para ti.
            </p>
          </div>

          {/* Map + info */}
          <div className="grid overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl lg:grid-cols-[1fr_380px]">
            {/* MAP */}
            <div className="relative min-h-[430px] overflow-hidden bg-muted">
              <iframe
                title="Mapa de ubicación de Colorins Onda"
                src="https://www.google.com/maps?q=Carrer+Metge+José+Llidó+8,+12200+Onda,+Castelló&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating map badge */}
              <div className="absolute left-5 top-5 rounded-2xl border border-white/60 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral text-white shadow-lg">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Nuestra tienda
                    </p>

                    <p className="font-bold text-foreground">
                      Colorins · Onda
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOCATION INFO */}
            <div className="flex flex-col justify-between bg-[oklch(0.24_0.05_264)] p-8 text-white sm:p-10">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral text-white shadow-lg shadow-coral/20">
                  <MapPin size={26} />
                </div>

                <h3 className="font-display text-3xl font-black">
                  Colorins
                </h3>

                <p className="mt-2 text-lg font-semibold text-white/60">
                  Llibreria · Papereria
                </p>

                <div className="mt-8 space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="mt-1 text-coral">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                        Dirección
                      </p>

                      <p className="mt-1 font-semibold leading-relaxed">
                        Carrer Metge José Llidó, 8
                        <br />
                        12200 Onda, Castelló
                      </p>
                    </div>
                  </div>

                  {/* Reference */}
                  <div className="flex gap-4">
                    <div className="mt-1 text-turquoise">
                      <Navigation size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                        Cómo encontrarnos
                      </p>

                      <p className="mt-1 font-semibold leading-relaxed">
                        Justo enfrente del
                        <br />
                        CEIP Pío XII
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directions button */}
              <Button
                asChild
                size="lg"
                className="mt-10 h-14 w-full rounded-full bg-white font-extrabold text-[oklch(0.24_0.05_264)] shadow-xl transition-all hover:-translate-y-1 hover:bg-white/90"
              >
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Carrer+Metge+José+Llidó+8,+12200+Onda,+Castelló"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-2 h-5 w-5" />
                  Cómo llegar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Bottom location note */}
          <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <MapPin size={16} className="shrink-0 text-coral" />
            <span>
              Colorins · Carrer Metge José Llidó, 8 · 12200 Onda, Castelló
            </span>
          </div>
        </div>
      </section>
    </div>
  ),
});

