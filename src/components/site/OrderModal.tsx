import React, { useState } from "react";
import { X, Save, ShoppingBag, Plus, Trash2, User, MapPin, CreditCard } from "lucide-react";
import { Order, Product } from "../../types";
import { Button, Input, Textarea, money } from "./CommonUI";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: Partial<Order> & { items?: any[] }) => Promise<void>;
  products: Product[];
  loading: boolean;
}

export function OrderModal({ isOpen, onClose, onSave, products, loading }: OrderModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tarjeta de crédito");
  const [status, setStatus] = useState("Pendiente");
  const [notes, setNotes] = useState("");

  const [selectedItems, setSelectedItems] = useState<
    Array<{ product: Product; quantity: number }>
  >([]);

  if (!isOpen) return null;

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === prod.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].quantity += 1;
        return copy;
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, qty: number) => {
    if (qty <= 0) return handleRemoveItem(index);
    setSelectedItems((prev) => {
      const copy = [...prev];
      copy[index].quantity = qty;
      return copy;
    });
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    const itemsForSave = selectedItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image_url: item.product.image_url,
    }));

    await onSave({
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim() || null,
      customer_phone: customerPhone.trim() || null,
      shipping_address: shippingAddress.trim() || null,
      payment_method: paymentMethod,
      status,
      total,
      notes: notes.trim() || null,
      items: itemsForSave,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative my-8 w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Registrar Pedido Manual</h2>
              <p className="text-xs text-slate-400">
                Añade pedidos telefónicos o ventas directas en tienda
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombre del Cliente"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ej. Carmen Navarro"
              required
            />
            <Input
              label="Email del Cliente"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="carmen@ejemplo.com"
            />
            <Input
              label="Teléfono"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+34 600 000 000"
            />
            <div>
              <label className="mb-1.5 ml-0.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Forma de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#F26B5B]"
              >
                <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                <option value="Bizum">Bizum</option>
                <option value="PayPal">PayPal</option>
                <option value="Transferencia bancaria">Transferencia bancaria</option>
                <option value="Efectivo en tienda">Efectivo en tienda</option>
              </select>
            </div>
          </div>

          <Input
            label="Dirección de Envío"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            placeholder="Calle, número, piso, código postal y ciudad"
          />

          {/* Product selector for order items */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Productos en el Pedido ({selectedItems.length})
              </p>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddItem(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#F26B5B]"
              >
                <option value="" disabled>
                  + Agregar producto del catálogo...
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({money(p.price)}) - Stock: {p.stock}
                  </option>
                ))}
              </select>
            </div>

            {selectedItems.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-4 font-medium">
                Selecciona al menos un producto para registrar el total.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200/80 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="font-bold text-xs text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {money(item.product.price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(idx, parseInt(e.target.value, 10) || 1)
                        }
                        className="w-14 rounded-lg border border-slate-200 px-2 py-1 text-center text-xs font-bold"
                      />
                      <span className="w-16 text-right font-black text-xs text-[#F26B5B]">
                        {money(item.product.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="rounded-lg p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-xs font-bold text-slate-600">Total del Pedido:</span>
              <span className="text-base font-black text-[#F26B5B]">{money(total)}</span>
            </div>
          </div>

          <Textarea
            label="Notas Internas"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Indicaciones especiales de empaquetado, horarios de entrega..."
          />

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" secondary onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || selectedItems.length === 0}>
              <Save size={16} />
              <span>{loading ? "Registrando..." : "Crear Pedido"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
