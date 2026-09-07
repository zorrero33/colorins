import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/lib/shop";
import { products } from "@/lib/colorins-data";
import { ProductCard } from "@/components/site/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoritos")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useShop();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold flex items-center gap-3">
        <Heart className="fill-pink text-pink" /> Mis Favoritos
      </h1>
      
      {favProducts.length === 0 ? (
        <div className="mt-12 text-center py-20 bg-muted/30 rounded-[2.5rem] border border-dashed">
          <p className="text-xl text-muted-foreground">No tienes productos en favoritos todavía.</p>
          <Button asChild className="mt-6 rounded-full px-8" size="lg">
            <Link to="/tienda">Ir a la tienda</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}