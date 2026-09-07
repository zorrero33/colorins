import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { categories, products } from "@/lib/colorins-data";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Search = { cat?: string; q?: string };

export const Route = createFileRoute("/tienda")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    ...(typeof search["cat"] === "string" ? { cat: search["cat"] } : {}),
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Tienda online | Colorins Onda" },
      {
        name: "description",
        content:
          "Compra libros, papelería, material escolar, arte y regalos en la tienda online de Colorins, en Onda (Castelló).",
      },
      { property: "og:title", content: "Tienda online | Colorins Onda" },
      { property: "og:description", content: "Libros, papelería, material escolar y regalos en Onda." },
    ],
  }),
  component: Tienda,
});

const PAGE = 8;

function Tienda() {
  const search = Route.useSearch();
  const [cat, setCat] = useState(search.cat ?? "todas");
  const [q, setQ] = useState(search.q ?? "");
  const [maxPrice, setMaxPrice] = useState(40);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [sort, setSort] = useState("relevancia");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products.filter((p) => {
      if (cat !== "todas" && p.category !== cat) return false;
      if (term && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(term)) return false;
      if (p.price > maxPrice) return false;
      if (onlyStock && p.stock === 0) return false;
      if (onlyOffers && !p.compareAt) return false;
      if (onlyNew && !p.isNew) return false;
      return true;
    });
    if (sort === "precio-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "nombre") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cat, q, maxPrice, onlyStock, onlyOffers, onlyNew, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE, current * PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <nav aria-label="Migas de pan" className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Inicio
        </Link>{" "}
        / <span className="text-foreground">Tienda</span>
      </nav>
      <h1 className="mt-3 font-display text-4xl font-extrabold">Tienda</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Catálogo de demostración. Los productos, precios y stock reales se gestionarán desde el panel de administración.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="surface-card h-fit p-5" aria-label="Filtros">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <SlidersHorizontal className="size-4 text-coral" /> Filtros
          </h2>

          <div className="mt-5 space-y-5 text-sm">
            <div>
              <label htmlFor="buscar" className="font-semibold">
                Buscar
              </label>
              <Input
                id="buscar"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Nombre, marca…"
                className="mt-2"
              />
            </div>

            <div>
              <p className="font-semibold">Categoría</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCat("todas");
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${cat === "todas" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Todas
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setCat(c.slug);
                      setPage(1);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${cat === c.slug ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold">Precio máximo: {maxPrice} €</p>
              <Slider
                className="mt-3"
                value={[maxPrice]}
                min={1}
                max={40}
                step={1}
                onValueChange={(v) => setMaxPrice(v[0] ?? 40)}
                aria-label="Precio máximo"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <Checkbox checked={onlyStock} onCheckedChange={(v) => setOnlyStock(v === true)} /> Solo disponibles
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={onlyOffers} onCheckedChange={(v) => setOnlyOffers(v === true)} /> Solo ofertas
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={onlyNew} onCheckedChange={(v) => setOnlyNew(v === true)} /> Solo novedades
              </label>
            </div>

            <p className="text-xs text-muted-foreground">
              Filtros por marca, edad y valoración quedarán disponibles al conectar el catálogo real.
            </p>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{filtered.length} productos</p>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-56" aria-label="Ordenar">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevancia</SelectItem>
                <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="nombre">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visible.length === 0 ? (
            <div className="surface-card mt-6 p-12 text-center">
              <p className="font-display text-2xl font-bold">Sin resultados</p>
              <p className="mt-2 text-muted-foreground">
                No hay productos que coincidan con los filtros seleccionados.
              </p>
              <Button asChild variant="secondary" className="mt-4 rounded-full">
                <Link to="/contacto">Consultar disponibilidad</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav aria-label="Paginación" className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  aria-current={current === i + 1 ? "page" : undefined}
                  className={`min-h-11 min-w-11 rounded-full px-4 text-sm font-semibold ${current === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
