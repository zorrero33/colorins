import type {
  Product,
  Business,
  OpeningHour,
  Service,
} from "../types";

export type { Product, Business, OpeningHour, Service } from "../types";

// src/lib/colorins-data.ts

export const business = {
  name: "COLORINS",
  tagline: "Llibreria, Papereria i Regals",
  street: "Carrer Metge José Llidó, 8",
  postalCode: "12200",
  city: "Onda",
  province: "Castelló",
  phone: "600 000 000",
  email: "hola@colorinsonda.com",
  mapQuery: "Carrer Metge José Llidó, 8, 12200 Onda, Castelló",
  socials: [
    { label: "Instagram", url: "https://instagram.com/colorins_onda" },
    { label: "Facebook", url: "https://facebook.com/colorinsonda" },
    { label: "WhatsApp", url: "https://wa.me/34600000000" }
  ]
};

export const openingHours = [
  { day: "Lunes a Viernes", value: "Pendiente de configurar" },
  { day: "Sábado", value: "Pendiente de configurar" },
  { day: "Domingo", value: "Cerrado" }
];

export const categories = [
  { slug: "libros", name: "Libros", emoji: "📚", tone: "coral", blurb: "Narrativa y más" },
  { slug: "papeleria", name: "Papelería", emoji: "✏️", tone: "sun", blurb: "Todo para escribir" },
  { slug: "material-escolar", name: "Material escolar", emoji: "🎒", tone: "turquoise", blurb: "Vuelta al cole" }
];

export const products = [
  { 
    id: "1", 
    slug: "demo-1", 
    name: "Producto COLORINS", 
    price: 10, 
    compareAt: 12,
    isNew: true,
    category: "papeleria", 
    emoji: "📓", 
    isFeatured: true, 
    stock: 10, 
    description: "Calidad profesional.", 
    brand: "Colorins", 
    sku: "COL-01",
    active: true,
    tone: "sun"
  }
];

export const services = [
  { slug: "impresion", name: "Impresión", emoji: "🖨️", enabled: true }
];

export const reviews = [
  { id: "r1", status: "publicada", rating: 5, text: "Excelente tienda en Onda.", name: "Cliente Colorins" }
];

export const posts = [
  { slug: "bienvenida", title: "Bienvenidos a nuestra nueva web", category: "Novedades", date: "2026-09-07", author: "Colorins", excerpt: "Ya estamos online.", emoji: "✨", tone: "sun" }
];

export const schoolLists = [
  { id: "sl1", school: "CEIP Pío XII", rows: [{ course: "1º Primaria", group: "A", item: "Pack material", qty: 1, availability: "Disponible" }] }
];

// ESTO ES LO QUE DABA EL ERROR "MISSING EXPORT"
export const toneClass: Record<string, string> = {
  coral: "bg-coral text-white",
  sun: "bg-sun text-white",
  turquoise: "bg-turquoise text-white",
  grape: "bg-grape text-white"
};

export const toneSoft: Record<string, string> = {
  coral: "bg-coral/10 text-coral",
  sun: "bg-sun/10 text-sun",
  turquoise: "bg-turquoise/10 text-turquoise",
  grape: "bg-grape/10 text-grape"
};

export const formatPrice = (n: number) => 
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);