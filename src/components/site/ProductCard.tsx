import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { formatPrice, toneClass, type Product } from "@/lib/colorins-data";
import { useShop } from "@/lib/shop";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useShop();
  const fav = favorites.includes(product.id);

  return (
    <article className="surface-card group relative flex flex-col overflow-hidden">
      <Link
        to="/tienda/$slug" params={{ slug: product.slug! }}
        className="relative grid aspect-4/3 place-items-center bg-[image:var(--gradient-cool)]/10"
        aria-label={product.name}
      >
        <span className="text-6xl transition-transform duration-500 group-hover:scale-110" aria-hidden>
          {product.emoji}
        </span>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase">
            Demo
          </span>
          {product.isNew && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${toneClass["sun"]}`}>Nuevo</span>
          )}
          {product.compareAt && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${toneClass["coral"]}`}>Oferta</span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleFavorite(product.id)}
        aria-label={fav ? `Quitar ${product.name} de favoritos` : `Añadir ${product.name} a favoritos`}
        aria-pressed={fav}
        className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
      >
        <Heart className={`size-4 ${fav ? "fill-pink text-pink" : "text-muted-foreground"}`} />
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase">{product.category.replace(/-/g, " ")}</p>
        <h3 className="mt-1 font-display text-base leading-snug font-bold">
          <Link to="/tienda/$slug" params={{ slug: product.slug! }} className="hover:text-coral">
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>
        <p className={`mt-1 text-xs font-medium ${product.stock > 0 ? "text-leaf" : "text-destructive"}`}>
          {product.stock > 0 ? `En stock (${product.stock})` : "Sin stock"}
        </p>

        <Button
          className="mt-4 w-full rounded-full"
          variant="secondary"
          disabled={product.stock === 0}
          onClick={() => {
            addToCart(product.id);
            toast.success(`${product.name} añadido al carrito`);
          }}
        >
          <ShoppingBag className="size-4" /> Añadir al carrito
        </Button>
      </div>
    </article>
  );
}
