import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Search,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  color: string;
  emoji: string;
};

const posts: BlogPost[] = [
  {
    id: 1,
    slug: "ideas-para-vuelta-al-cole",
    title: "Ideas para preparar la vuelta al cole",
    excerpt:
      "Organiza todo lo necesario para empezar el curso con ilusión, orden y mucho color.",
    category: "Cole",
    date: "7 septiembre 2026",
    readTime: "4 min",
    color: "coral",
    emoji: "🎒",
  },
  {
    id: 2,
    slug: "material-escolar-creativo",
    title: "Material escolar para despertar la creatividad",
    excerpt:
      "Descubre materiales sencillos para transformar los deberes y proyectos en algo mucho más divertido.",
    category: "Creatividad",
    date: "2 septiembre 2026",
    readTime: "5 min",
    color: "turquoise",
    emoji: "🎨",
  },
  {
    id: 3,
    slug: "organizar-escritorio",
    title: "Cómo organizar tu escritorio",
    excerpt:
      "Un espacio ordenado ayuda a estudiar, trabajar y crear mejor. Te damos algunas ideas prácticas.",
    category: "Organización",
    date: "28 agosto 2026",
    readTime: "3 min",
    color: "yellow",
    emoji: "✏️",
  },
  {
    id: 4,
    slug: "ideas-regalos-papeleria",
    title: "Ideas de regalo para amantes de la papelería",
    excerpt:
      "Pequeños detalles llenos de color que pueden convertirse en regalos muy especiales.",
    category: "Ideas",
    date: "20 agosto 2026",
    readTime: "4 min",
    color: "purple",
    emoji: "🎁",
  },
  {
    id: 5,
    slug: "dibujar-con-ninos",
    title: "Ideas para dibujar y crear con niños",
    excerpt:
      "Actividades fáciles para pasar un rato creativo en familia utilizando materiales de papelería.",
    category: "Creatividad",
    date: "12 agosto 2026",
    readTime: "6 min",
    color: "pink",
    emoji: "🖍️",
  },
  {
    id: 6,
    slug: "papeleria-onda",
    title: "Colorins, tu papelería en Onda",
    excerpt:
      "Conoce nuestra tienda y descubre todo lo que puedes encontrar para estudiar, trabajar y crear.",
    category: "Colorins",
    date: "5 agosto 2026",
    readTime: "3 min",
    color: "coral",
    emoji: "🌈",
  },
];

const categories = [
  "Todos",
  "Cole",
  "Creatividad",
  "Organización",
  "Ideas",
  "Colorins",
];

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

function BlogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === "Todos" || post.category === category;

      const matchesSearch =
        !term ||
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-coral/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-turquoise/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-coral">
              <Sparkles className="h-4 w-4" />
              Blog Colorins
            </div>

            <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight text-[oklch(0.24_0.05_264)] sm:text-6xl lg:text-7xl">
              Ideas que dan
              <span className="text-gradient-brand"> color </span>
              a tu día
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Consejos, ideas, inspiración y novedades de Colorins para el
              cole, la creatividad, la papelería y mucho más.
            </p>
          </div>
        </div>
      </section>

      {/* CONTROLES */}
      <section className="sticky top-[82px] z-30 border-y border-border/70 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* CATEGORÍAS */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const selected = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`
                    shrink-0 rounded-full px-4 py-2
                    text-sm font-extrabold
                    transition-all duration-300
                    ${
                      selected
                        ? "bg-coral text-white shadow-lg shadow-coral/20"
                        : "bg-muted text-muted-foreground hover:-translate-y-0.5 hover:bg-coral/10 hover:text-coral"
                    }
                  `}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {/* BUSCADOR */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar artículos..."
              className="
                h-11 w-full rounded-full
                border border-border
                bg-white pl-11 pr-4
                text-sm font-medium
                outline-none
                transition-all duration-300
                focus:border-coral
                focus:ring-4 focus:ring-coral/10
              "
            />
          </div>
        </div>
      </section>

      {/* ARTÍCULOS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {filteredPosts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />

            <h2 className="mt-5 text-2xl font-black">
              No hemos encontrado artículos
            </h2>

            <p className="mt-2 text-muted-foreground">
              Prueba con otra búsqueda o categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="
                  group overflow-hidden rounded-[2rem]
                  border border-border bg-card
                  shadow-sm
                  transition-all duration-500
                  hover:-translate-y-2
                  hover:border-transparent
                  hover:shadow-2xl
                "
              >
                {/* CABECERA VISUAL */}
                <div
                  className={`
                    relative flex h-48 items-center justify-center
                    overflow-hidden
                    ${
                      post.color === "coral"
                        ? "bg-coral/10"
                        : post.color === "turquoise"
                          ? "bg-turquoise/10"
                          : post.color === "yellow"
                            ? "bg-yellow-400/15"
                            : post.color === "purple"
                              ? "bg-purple-500/10"
                              : "bg-pink/10"
                    }
                  `}
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/60 transition-transform duration-700 group-hover:scale-[2]" />

                  <span className="relative z-10 text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    {post.emoji}
                  </span>

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black shadow-sm backdrop-blur">
                    {post.category}
                  </div>
                </div>

                {/* CONTENIDO */}
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs font-bold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl font-black leading-tight transition-colors duration-300 group-hover:text-coral">
                    {post.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <Link
                    to="/blog"
                    className="
                      group/link mt-6 inline-flex
                      items-center font-black text-coral
                    "
                  >
                    Leer artículo
                    <ArrowRight
                      className="
                        ml-2 h-4 w-4
                        transition-transform duration-300
                        group-hover/link:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[oklch(0.24_0.05_264)] px-6 py-14 text-white shadow-2xl sm:px-12 lg:px-20">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-coral/30 blur-3xl" />

          <div className="absolute -bottom-32 left-20 h-72 w-72 rounded-full bg-turquoise/20 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest">
                <Tag className="h-4 w-4" />
                Colorins
              </div>

              <h2 className="font-display text-4xl font-black sm:text-5xl">
                ¿Tienes una idea?
              </h2>

              <p className="mt-3 max-w-xl text-white/60">
                Ven a visitarnos en Onda y encuentra todo lo que necesitas
                para hacerla realidad.
              </p>
            </div>

            <Link
              to="/tienda"
              className="
                inline-flex h-14 items-center rounded-full
                bg-white px-7
                font-black text-[oklch(0.24_0.05_264)]
                shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                hover:bg-white/90
              "
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Ver tienda
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
