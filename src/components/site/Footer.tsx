import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";
import { useShop } from "@/lib/shop";

export function Footer() {
  const { settings } = useShop();
  const b = settings.business;

  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-xl font-extrabold">COLORINS</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Libros, papelería, creatividad y mucho más.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-coral" />
              <span>
                {b.street}
                <br />
                {b.postalCode} {b.city}, {b.province}
              </span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-turquoise" />
              <span className="text-muted-foreground">{b.phone}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-grape" />
              <span className="text-muted-foreground">{b.email}</span>
            </li>
          </ul>
        </div>

        <nav aria-label="Enlaces del sitio" className="grid grid-cols-2 gap-8 lg:col-span-2">
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">Tienda</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tienda" className="hover:text-foreground">Todos los productos</Link></li>
              <li><Link to="/cole" className="hover:text-foreground">Todo para el cole</Link></li>
              <li><Link to="/tienda" className="hover:text-foreground">Ofertas y promociones</Link></li>
              <li><Link to="/favoritos" className="hover:text-foreground">Favoritos</Link></li>
              <li><Link to="/tienda" className="hover:text-foreground">Mi cuenta</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">Colorins</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="hover:text-foreground">Sobre Colorins</Link></li>
              <li><Link to="/sobre" className="hover:text-foreground">Reseñas</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">Blog y novedades</Link></li>
              <li><Link to="/contacto" className="hover:text-foreground">Eventos</Link></li>
              <li><Link to="/contacto" className="hover:text-foreground">Contacto</Link></li>
            </ul>
          </div>
        </nav>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Newsletter</h3>
          <Newsletter compact />
          <div className="mt-6 flex flex-wrap gap-2">
            {b.socials.map((s) => (
              <span
                key={s.label}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                title="Perfil pendiente de configurar"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Colorins · {b.city}, {b.province}</p>
          <nav aria-label="Enlaces legales" className="flex flex-wrap gap-4">
            <Link to="/sobre" className="hover:text-foreground">Privacidad</Link>
            <Link to="/sobre" className="hover:text-foreground">Cookies</Link>
            <Link to="/sobre" className="hover:text-foreground">Aviso legal</Link>
            <Link to="/sobre" className="hover:text-foreground">Condiciones</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
