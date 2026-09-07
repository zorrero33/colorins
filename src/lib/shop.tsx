import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  business as defaultBusiness,
  openingHours as defaultHours,
  products as catalog,
  services as defaultServices,
  type Business,
  type OpeningHour,
  type Product,
  type Service,
} from "./colorins-data";

/**
 * Estado del prototipo (carrito, favoritos y ajustes editables).
 * Persistencia local en el navegador.
 * PUNTO DE INTEGRACIÓN: sustituir por API + base de datos y sesión de usuario.
 */

type CartLine = { id: string; qty: number; variant?: string | undefined };

type SiteSettings = {
  business: Business;
  hours: OpeningHour[];
  services: Service[];
};

type ShopState = {
  cart: CartLine[];
  favorites: string[];
  settings: SiteSettings;
  addToCart: (id: string, qty?: number, variant?: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  cartCount: number;
  cartTotal: number;
  cartDetailed: { product: Product; line: CartLine }[];
  updateSettings: (next: Partial<SiteSettings>) => void;
  resetSettings: () => void;
};

const KEY = "colorins.state.v1";
const ShopContext = createContext<ShopState | null>(null);

const defaultSettings: SiteSettings = {
  business: defaultBusiness,
  hours: defaultHours,
  services: defaultServices,
};

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.cart) setCart(parsed.cart);
      if (parsed.favorites) setFavorites(parsed.favorites);
      if (parsed.settings) setSettings({ ...defaultSettings, ...parsed.settings });
    } catch {
      /* estado local no disponible */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart, favorites, settings }));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [cart, favorites, settings]);

  const addToCart = useCallback((id: string, qty = 1, variant?: string) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty, variant: variant ?? l.variant } : l));
      return [...prev, { id, qty, variant }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((p) => p.filter((l) => l.id !== id)), []);
  const setQty = useCallback(
    (id: string, qty: number) =>
      setCart((p) => (qty <= 0 ? p.filter((l) => l.id !== id) : p.map((l) => (l.id === id ? { ...l, qty } : l)))),
    [],
  );
  const clearCart = useCallback(() => setCart([]), []);
  const toggleFavorite = useCallback(
    (id: string) => setFavorites((p) => (p.includes(id) ? p.filter((f) => f !== id) : [...p, id])),
    [],
  );
  const updateSettings = useCallback((next: Partial<SiteSettings>) => setSettings((p) => ({ ...p, ...next })), []);
  const resetSettings = useCallback(() => setSettings(defaultSettings), []);

  const cartDetailed = useMemo(
    () =>
      cart
        .map((line) => {
          const product = catalog.find((p) => p.id === line.id);
          return product ? { product, line } : null;
        })
        .filter(Boolean) as { product: Product; line: CartLine }[],
    [cart],
  );

  const value: ShopState = {
    cart,
    favorites,
    settings,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleFavorite,
    cartCount: cart.reduce((s, l) => s + l.qty, 0),
    cartTotal: cartDetailed.reduce((s, { product, line }) => s + product.price * line.qty, 0),
    cartDetailed,
    updateSettings,
    resetSettings,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop debe usarse dentro de ShopProvider");
  return ctx;
}
