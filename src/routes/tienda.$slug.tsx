import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Heart, ShoppingBag, Star, Truck, ShieldCheck, ArrowLeftRight } from "lucide-react";
import { products, formatPrice, toneSoft } from "@/lib/colorins-data";
import { useShop } from "@/lib/shop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/tienda/$slug")({
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { addToCart, toggleFavorite, favorites } = useShop();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center">
        <h2 className="font-display text-2xl font-bold">Producto no encontrado</h2>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/tienda">Volver a la tienda</Link>
        </Button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/tienda" className="hover:text-foreground">Tienda</Link>
        <span>/</span>
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Galería / Imagen */}
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-[image:var(--gradient-cool)]/10 flex items-center justify-center">
           <span className="text-[12rem]">{product.emoji}</span>
           <button 
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-6 right-6 p-3 rounded-full bg-background shadow-md"
           >
            <Heart className={`size-6 ${isFav ? "fill-pink text-pink" : ""}`} />
           </button>
        </div>

        {/* Información */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
          <h1 className="font-display text-4xl font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">SKU: {product.sku} | Marca: {product.brand}</p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-4xl font-extrabold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-xl text-muted-foreground line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>

          <div className="mt-8 space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center border rounded-full px-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3">-</button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-3">+</button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 rounded-full h-14 text-lg font-bold"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product.id, qty);
                  toast.success(`${product.name} añadido al carrito`);
                }}
              >
                <ShoppingBag className="mr-2" /> Añadir al carrito
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Truck className="text-turquoise size-5" /> Envío a Onda y alrededores
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <ShieldCheck className="text-leaf size-5" /> Calidad garantizada
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <ArrowLeftRight className="text-coral size-5" /> Devolución en tienda
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}