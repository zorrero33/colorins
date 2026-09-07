import { createFileRoute, Link } from "@tanstack/react-router";
import { useShop } from "@/lib/shop";
import { formatPrice } from "@/lib/colorins-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2, CreditCard, Truck } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartDetailed, cartTotal, clearCart } = useShop();
  const [step, setStep] = useState(1); // 1: Datos, 2: Confirmación

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    clearCart();
    toast.success("¡Pedido realizado con éxito!");
    // Aquí se dispararía la notificación a Telegram en el backend
  };

  if (cartDetailed.length === 0 && step === 1) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <Button asChild className="mt-4 rounded-full"><Link to="/tienda">Ir a la tienda</Link></Button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <div className="size-20 bg-leaf/20 text-leaf rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-display text-4xl font-extrabold">¡Gracias por tu pedido!</h1>
        <p className="mt-4 text-muted-foreground text-lg">Hemos recibido tu solicitud. Te enviaremos un correo electrónico con los detalles para la recogida o envío.</p>
        <Button asChild className="mt-8 rounded-full px-8" size="lg"><Link to="/">Volver al inicio</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold mb-10">Finalizar Pedido</h1>
      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleOrder} className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><Truck size={20} /> Datos de Envío / Recogida</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Nombre completo" required />
              <Input placeholder="Teléfono" required />
              <Input className="sm:col-span-2" placeholder="Dirección completa (solo si es envío a domicilio)" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard size={20} /> Método de Pago</h2>
            <div className="p-4 border-2 border-turquoise bg-turquoise/5 rounded-2xl">
              <p className="font-bold">Pago en tienda / Transferencia</p>
              <p className="text-sm text-muted-foreground">Por seguridad, el pago se coordinará tras verificar el stock real.</p>
            </div>
          </section>
          
          <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold">Confirmar Pedido ({formatPrice(cartTotal)})</Button>
        </form>

        <aside className="surface-card p-6 h-fit">
          <h2 className="font-bold mb-4">Resumen</h2>
          <div className="space-y-4">
            {cartDetailed.map(({ product, line }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span>{product.name} (x{line.qty})</span>
                <span className="font-bold">{formatPrice(product.price * line.qty)}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between font-extrabold text-xl">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}