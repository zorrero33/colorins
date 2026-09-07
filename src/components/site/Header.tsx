import { Link } from "@tanstack/react-router";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  BookOpen,
  GraduationCap,
  Info,
  MessageCircle,
  Home,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { useShop } from "@/lib/shop";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    to: "/",
    label: "Inicio",
    icon: Home,
  },
  {
    to: "/tienda",
    label: "Tienda",
    icon: Store,
  },
  {
    to: "/cole",
    label: "Todo para el Cole",
    icon: GraduationCap,
  },
  {
    to: "/sobre",
    label: "Sobre nosotros",
    icon: Info,
  },
  {
    to: "/blog",
    label: "Blog",
    icon: BookOpen,
  },
  {
    to: "/contacto",
    label: "Contacto",
    icon: MessageCircle,
  },
] as const;

export function Header() {
  const { cartCount, favorites } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 shadow-sm backdrop-blur-xl">
      {/* BARRA SUPERIOR */}
      <div className="bg-gradient-to-r from-coral via-sun to-turquoise px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.16em] text-white sm:text-xs">
        Librería Colorins · Carrer Metge José Llidó, 8 · Junto al CEIP Pío XII
      </div>

      {/* HEADER PRINCIPAL */}
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Logo />
          </div>

          <div className="hidden flex-col sm:flex">
            <span className="font-display text-xl font-black leading-none tracking-tighter">
              COLOR<span className="text-coral">I</span>NS
            </span>

            <span className="mt-1 text-[10px] font-bold uppercase leading-none text-muted-foreground">
              Llibreria · Papereria
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={
                  item.to === "/" ? { exact: true } : undefined
                }
                onClick={() => setMobileOpen(false)}
                className="
                  group relative flex items-center gap-2
                  rounded-full px-3 py-2.5
                  text-sm font-extrabold text-muted-foreground
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-muted
                  hover:text-foreground
                "
                activeProps={{
                  className: `
                    group relative flex items-center gap-2
                    rounded-full px-3 py-2.5
                    text-sm font-extrabold
                    transition-all duration-300
                    -translate-y-0.5
                    bg-coral/10 text-coral
                    shadow-sm
                  `,
                }}
              >
                <Icon
                  className="
                    h-4 w-4
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />

                <span>{item.label}</span>

                <span
                  className="
                    absolute bottom-1 left-1/2
                    h-0.5 w-0
                    -translate-x-1/2
                    rounded-full bg-current
                    transition-all duration-300
                    group-hover:w-1/2
                  "
                />
              </Link>
            );
          })}
        </nav>

        {/* ACCIONES */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* FAVORITOS */}
          <Link
            to="/favoritos"
            aria-label="Favoritos"
            className="
              group relative rounded-full p-2.5
              text-muted-foreground
              transition-all duration-300
              hover:-translate-y-1
              hover:bg-pink/10
              hover:text-pink
            "
          >
            <Heart
              className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                favorites.length > 0 ? "fill-current" : ""
              }`}
            />

            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[9px] font-black text-white shadow-md">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* CARRITO */}
          <Link
            to="/checkout"
            aria-label="Carrito"
            className="
              group relative rounded-full p-2.5
              text-muted-foreground
              transition-all duration-300
              hover:-translate-y-1
              hover:bg-coral/10
              hover:text-coral
            "
          >
            <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />

            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] font-black text-white shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ADMIN */}
          <div className="mx-1 hidden h-7 w-px bg-border lg:block" />

          <Link
            to="/admin"
            aria-label="Administración"
            className="
              group hidden rounded-full
              border border-transparent
              p-2.5 text-muted-foreground
              transition-all duration-300
              hover:-translate-y-1
              hover:border-purple-200
              hover:bg-purple-50
              hover:text-purple-600
              lg:flex
            "
          >
            <ShieldCheck
              className="
                h-5 w-5
                transition-transform duration-300
                group-hover:scale-110
              "
            />
          </Link>

          {/* COMPRAR */}
          <Button
            asChild
            className="
              hidden rounded-full bg-coral px-5
              font-black text-white
              shadow-lg shadow-coral/20
              transition-all duration-300
              hover:-translate-y-1
              hover:bg-coral/90
            "
          >
            <Link to="/tienda">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Comprar ya
            </Link>
          </Button>

          {/* MÓVIL */}
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((value) => !value)}
            className="
              rounded-full p-2.5
              text-muted-foreground
              transition-all duration-300
              hover:bg-muted hover:text-foreground
              lg:hidden
            "
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div
        className={`
          overflow-hidden border-t border-border/50 bg-white
          transition-all duration-300 lg:hidden
          ${
            mobileOpen
              ? "max-h-[800px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={
                  item.to === "/" ? { exact: true } : undefined
                }
                onClick={() => setMobileOpen(false)}
                className="
                  group flex items-center gap-3
                  rounded-2xl px-4 py-3
                  font-bold text-muted-foreground
                  transition-all duration-300
                  hover:translate-x-1
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <Icon className="h-5 w-5" />
                </span>

                {item.label}
              </Link>
            );
          })}

          <div className="my-3 border-t border-border" />

          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="
              group flex items-center gap-3
              rounded-2xl border border-purple-200
              bg-purple-50 px-4 py-3
              font-bold text-purple-700
              transition-all duration-300
              hover:-translate-y-0.5
              hover:bg-purple-100
            "
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>

            Administración
          </Link>
        </nav>
      </div>
    </header>
  );
}
