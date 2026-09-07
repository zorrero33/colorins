import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import dotenv from "dotenv";

dotenv.config();

// Resolve database path from .env securely
const dbPath = process.env["DATABASE_PATH"] || "./data/colorins.db";
const resolvedDbDir = path.dirname(path.resolve(process.cwd(), dbPath));

if (!fs.existsSync(resolvedDbDir)) {
  fs.mkdirSync(resolvedDbDir, { recursive: true });
}

export const db = new DatabaseSync(path.resolve(process.cwd(), dbPath));

// Enable WAL mode for better concurrency and speed
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Administrador',
      role TEXT NOT NULL DEFAULT 'superadmin',
      last_login TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      sku TEXT,
      price REAL NOT NULL,
      old_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      tax REAL NOT NULL DEFAULT 21,
      weight TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      shipping_address TEXT,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendiente',
      payment_method TEXT DEFAULT 'Tarjeta de crédito',
      items_json TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      site_name TEXT NOT NULL DEFAULT 'Colorins',
      tagline TEXT NOT NULL DEFAULT 'Papelería Creativa',
      email TEXT DEFAULT 'hola@colorinspapeleria.es',
      phone TEXT DEFAULT '+34 912 345 678',
      currency TEXT DEFAULT '€',
      tax_rate REAL DEFAULT 21,
      free_shipping_from REAL DEFAULT 50,
      maintenance INTEGER DEFAULT 0,
      logo_url TEXT DEFAULT '',
      favicon_url TEXT DEFAULT '',
      address TEXT DEFAULT 'Calle Gran Vía 42, 28013 Madrid, España',
      working_hours TEXT DEFAULT 'Lunes a Viernes 09:00 - 19:00'
    );

    CREATE TABLE IF NOT EXISTS design_settings (
      id TEXT PRIMARY KEY,
      primary_color TEXT DEFAULT '#F26B5B',
      secondary_color TEXT DEFAULT '#F8C84A',
      accent_color TEXT DEFAULT '#45C4C9',
      background_color TEXT DEFAULT '#FFFFFF',
      text_color TEXT DEFAULT '#202338',
      radius TEXT DEFAULT '16px',
      font TEXT DEFAULT 'Plus Jakarta Sans',
      button_style TEXT DEFAULT 'rounded'
    );

    CREATE TABLE IF NOT EXISTS seo_settings (
      id TEXT PRIMARY KEY,
      title TEXT DEFAULT 'Colorins | Papelería Creativa y Material Escolar',
      description TEXT DEFAULT 'Descubre en Colorins la papelería más bonita: cuadernos bullet journal, washi tapes, bolígrafos de gel, pegatinas y organizadores para tu día a día.',
      keywords TEXT DEFAULT 'papeleria bonita, bullet journal, washi tape, cuadernos pastel, rotuladores lettering',
      og_image TEXT DEFAULT 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1200&auto=format&fit=crop&q=80',
      twitter_handle TEXT DEFAULT '@colorinspapeleria'
    );

    CREATE TABLE IF NOT EXISTS legal_settings (
      id TEXT PRIMARY KEY,
      privacy TEXT,
      terms TEXT,
      cookies TEXT,
      returns TEXT,
      legal_notice TEXT
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      table_name TEXT,
      description TEXT NOT NULL,
      user TEXT DEFAULT 'admin',
      created_at TEXT NOT NULL
    );
  `);

  // Ensure default admin user from .env
  const adminEmail = process.env["ADMIN_EMAIL"] || "admin@colorins.com";
  const adminPass = process.env["ADMIN_PASSWORD"] || "admin123";
  const userCheck = db.prepare("SELECT id FROM admin_users WHERE email = ?").get(adminEmail);

  if (!userCheck) {
    const userId = "usr_" + crypto.randomUUID().slice(0, 8);
    const passHash = hashPassword(adminPass);
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, name, role, created_at)
      VALUES (?, ?, ?, 'Admin Colorins', 'superadmin', ?)
    `).run(userId, adminEmail, passHash, new Date().toISOString());
  }

  // Ensure default singletons
  const settingsCheck = db.prepare("SELECT id FROM site_settings WHERE id = 'primary'").get();
  if (!settingsCheck) {
    db.prepare(`
      INSERT INTO site_settings (id, site_name, tagline, email, phone, currency, tax_rate, free_shipping_from, maintenance, logo_url, favicon_url, address, working_hours)
      VALUES ('primary', 'Colorins', 'Papelería Creativa', 'hola@colorinspapeleria.es', '+34 912 345 678', '€', 21, 50, 0, '', '', 'Calle Gran Vía 42, 28013 Madrid, España', 'Lunes a Viernes 09:00 - 19:00')
    `).run();
  }

  const designCheck = db.prepare("SELECT id FROM design_settings WHERE id = 'primary'").get();
  if (!designCheck) {
    db.prepare(`
      INSERT INTO design_settings (id, primary_color, secondary_color, accent_color, background_color, text_color, radius, font, button_style)
      VALUES ('primary', '#F26B5B', '#F8C84A', '#45C4C9', '#FFFFFF', '#202338', '16px', 'Plus Jakarta Sans', 'rounded')
    `).run();
  }

  const seoCheck = db.prepare("SELECT id FROM seo_settings WHERE id = 'primary'").get();
  if (!seoCheck) {
    db.prepare(`
      INSERT INTO seo_settings (id, title, description, keywords, og_image, twitter_handle)
      VALUES ('primary', 'Colorins | Papelería Creativa y Material Escolar', 'Descubre en Colorins la papelería más bonita: cuadernos bullet journal, washi tapes, bolígrafos de gel, pegatinas y organizadores para tu día a día.', 'papeleria bonita, bullet journal, washi tape, cuadernos pastel, rotuladores lettering', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1200&auto=format&fit=crop&q=80', '@colorinspapeleria')
    `).run();
  }

  const legalCheck = db.prepare("SELECT id FROM legal_settings WHERE id = 'primary'").get();
  if (!legalCheck) {
    db.prepare(`
      INSERT INTO legal_settings (id, privacy, terms, cookies, returns, legal_notice)
      VALUES ('primary', 
        'En Colorins tratamos los datos que nos facilita con el fin de prestarles el servicio solicitado o enviarle la información requerida...',
        'Las presentes condiciones regulan el uso de este sitio web y las compras efectuadas en la tienda online Colorins...',
        'Utilizamos cookies técnicas y analíticas necesarias para garantizar el correcto funcionamiento de la tienda...',
        'Dispone de un plazo de 14 días naturales desde la recepción de su pedido para realizar cualquier cambio o devolución sin coste adicional.',
        'Colorins Papelería Creativa S.L. - NIF: B-12345678 - Domicilio social en Calle Gran Vía 42, Madrid.'
      )
    `).run();
  }

  // Check if products exist, if not seed initial catalog
  const prodCount = (db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number }).count;
  if (prodCount === 0) {
    seedInitialData();
  }
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + (process.env["SESSION_SECRET"] || "colorins_salt")).digest("hex");
}

export function logActivity(action: string, tableName: string | null, description: string, user = "admin") {
  try {
    const id = "log_" + crypto.randomUUID().slice(0, 8);
    const createdAt = new Date().toISOString();
    db.prepare(`
      INSERT INTO activity_logs (id, action, table_name, description, user, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, action, tableName, description, user, createdAt);
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

export function seedInitialData() {
  const now = new Date().toISOString();

  // Categories
  const categories = [
    { id: "cat_cuadernos", name: "Cuadernos y Libretas", active: 1 },
    { id: "cat_escritura", name: "Escritura y Rotuladores", active: 1 },
    { id: "cat_washitape", name: "Washi Tape y Pegatinas", active: 1 },
    { id: "cat_organizacion", name: "Planificadores y Agendas", active: 1 },
    { id: "cat_accesorios", name: "Accesorios y Estuches", active: 1 },
  ];

  const insertCat = db.prepare("INSERT OR IGNORE INTO categories (id, name, active, created_at) VALUES (?, ?, ?, ?)");
  for (const c of categories) {
    insertCat.run(c.id, c.name, c.active, now);
  }

  // Products
  const products = [
    {
      id: "prod_01",
      name: "Cuaderno Bullet Journal Pastel A5 (160 gsm)",
      category: "Cuadernos y Libretas",
      sku: "COL-BJO-001",
      price: 18.90,
      old_price: 22.00,
      stock: 24,
      description: "Cuaderno con encuadernación en tela de lino, hojas punteadas de 160 gsm que no traspasan con rotuladores acuarelables ni tintas densas.",
      image_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 1,
      tax: 21,
      weight: "450 g"
    },
    {
      id: "prod_02",
      name: "Set de 12 Rotuladores Brush Pastel & Vintage",
      category: "Escritura y Rotuladores",
      sku: "COL-ROT-002",
      price: 14.50,
      old_price: 16.95,
      stock: 35,
      description: "Doble punta: punta pincel flexible para lettering y punta fina de 0.4mm para detalles y esquemas.",
      image_url: "https://images.unsplash.com/photo-1585336261026-40742f1cf57b?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 1,
      tax: 21,
      weight: "180 g"
    },
    {
      id: "prod_03",
      name: "Pack 6 Washi Tapes Botánicos con Foil Dorado",
      category: "Washi Tape y Pegatinas",
      sku: "COL-WSH-003",
      price: 9.95,
      old_price: 12.50,
      stock: 40,
      description: "Cintas adhesivas de papel de arroz japonés con delicados motivos florales, hojas y detalles dorados en relieve.",
      image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 1,
      tax: 21,
      weight: "120 g"
    },
    {
      id: "prod_04",
      name: "Planificador Semanal de Escritorio Sin Fechas",
      category: "Planificadores y Agendas",
      sku: "COL-PLN-004",
      price: 12.00,
      old_price: null,
      stock: 4, // Low stock for dashboard testing
      description: "Bloc de 60 hojas encoladas encoladas para organizar semanas de trabajo, tareas prioritarias y hábitos diarios.",
      image_url: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 0,
      tax: 21,
      weight: "320 g"
    },
    {
      id: "prod_05",
      name: "Bolígrafo de Gel Tinta Secado Rápido 0.5mm (Pack 5)",
      category: "Escritura y Rotuladores",
      sku: "COL-GEL-005",
      price: 7.50,
      old_price: 8.90,
      stock: 50,
      description: "Tinta negra ultra fluida que no mancha, ideal para zurdos y amantes de la escritura continua y sin saltos.",
      image_url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 1,
      tax: 21,
      weight: "90 g"
    },
    {
      id: "prod_06",
      name: "Estuche Enrollable de Pana Melocotón",
      category: "Accesorios y Estuches",
      sku: "COL-EST-006",
      price: 15.90,
      old_price: null,
      stock: 2, // Low stock
      description: "Capacidad para más de 30 lápices, tijeras y gomas. Tejido suave de pana lavable con cierre de cordón de ante.",
      image_url: "https://images.unsplash.com/photo-1596464716127-f2a829822301?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 0,
      tax: 21,
      weight: "150 g"
    },
    {
      id: "prod_07",
      name: "Set 150 Pegatinas Temáticas Naturaleza y Café",
      category: "Washi Tape y Pegatinas",
      sku: "COL-STK-007",
      price: 6.90,
      old_price: null,
      stock: 0, // Out of stock for testing
      description: "Pegatinas mate precortadas en papel translúcido japonés. Ilustraciones originales a todo color para tus notas.",
      image_url: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 0,
      tax: 21,
      weight: "50 g"
    },
    {
      id: "prod_08",
      name: "Libreta de Bolsillo Cuadrícula Dot (Pack de 3)",
      category: "Cuadernos y Libretas",
      sku: "COL-LIB-008",
      price: 11.50,
      old_price: 13.50,
      stock: 18,
      description: "Tamaño compacto A6 para llevar siempre en el bolso o mochila. Cubierta de cartulina kraft serigrafiada.",
      image_url: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80",
      active: 1,
      featured: 1,
      tax: 21,
      weight: "200 g"
    }
  ];

  const insertProd = db.prepare(`
    INSERT OR REPLACE INTO products (id, name, category, sku, price, old_price, stock, description, image_url, active, featured, tax, weight, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    insertProd.run(
      p.id,
      p.name,
      p.category,
      p.sku,
      p.price,
      p.old_price,
      p.stock,
      p.description,
      p.image_url,
      p.active,
      p.featured,
      p.tax,
      p.weight,
      now,
      now
    );
  }

  // Customers
  const customers = [
    {
      id: "cust_01",
      name: "Lucía Fernández",
      email: "lucia.fernandez@gmail.com",
      phone: "+34 654 321 987",
      address: "Calle Mayor 14, 28013 Madrid",
      notes: "Cliente habitual de Bullet Journal.",
      active: 1
    },
    {
      id: "cust_02",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@hotmail.com",
      phone: "+34 612 876 543",
      address: "Avenida Diagonal 245, 08018 Barcelona",
      notes: "Solicita siempre factura con NIF.",
      active: 1
    },
    {
      id: "cust_03",
      name: "Marta Gómez Rivas",
      email: "marta.gomez@yahoo.es",
      phone: "+34 689 112 233",
      address: "Paseo de la Alameda 18, 46010 Valencia",
      notes: "Prefiere entrega por las tardes.",
      active: 1
    },
    {
      id: "cust_04",
      name: "Elena Morales",
      email: "elena.morales@outlook.com",
      phone: "+34 633 445 566",
      address: "Calle Betis 9, 41010 Sevilla",
      notes: "Diseñadora gráfica y aficionada al lettering.",
      active: 1
    }
  ];

  const insertCust = db.prepare(`
    INSERT OR REPLACE INTO customers (id, name, email, phone, address, notes, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of customers) {
    insertCust.run(c.id, c.name, c.email, c.phone, c.address, c.notes, c.active, now);
  }

  // Orders
  const orders = [
    {
      id: "ord_1001",
      customer_name: "Lucía Fernández",
      customer_email: "lucia.fernandez@gmail.com",
      customer_phone: "+34 654 321 987",
      shipping_address: "Calle Mayor 14, 28013 Madrid",
      total: 33.40,
      status: "Entregado",
      payment_method: "Tarjeta de crédito",
      items_json: JSON.stringify([
        { id: "prod_01", name: "Cuaderno Bullet Journal Pastel A5", price: 18.90, quantity: 1 },
        { id: "prod_02", name: "Set de 12 Rotuladores Brush Pastel", price: 14.50, quantity: 1 }
      ]),
      notes: "Empaquetar para regalo si es posible.",
      created_at: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: "ord_1002",
      customer_name: "Carlos Mendoza",
      customer_email: "carlos.mendoza@hotmail.com",
      customer_phone: "+34 612 876 543",
      shipping_address: "Avenida Diagonal 245, 08018 Barcelona",
      total: 51.35,
      status: "Enviado",
      payment_method: "Bizum",
      items_json: JSON.stringify([
        { id: "prod_03", name: "Pack 6 Washi Tapes Botánicos", price: 9.95, quantity: 2 },
        { id: "prod_06", name: "Estuche Enrollable de Pana Melocotón", price: 15.90, quantity: 1 },
        { id: "prod_08", name: "Libreta de Bolsillo Cuadrícula Dot", price: 11.50, quantity: 1 }
      ]),
      notes: "Dejar en conserjería si no contesta.",
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: "ord_1003",
      customer_name: "Marta Gómez Rivas",
      customer_email: "marta.gomez@yahoo.es",
      customer_phone: "+34 689 112 233",
      shipping_address: "Paseo de la Alameda 18, 46010 Valencia",
      total: 19.50,
      status: "En preparación",
      payment_method: "PayPal",
      items_json: JSON.stringify([
        { id: "prod_04", name: "Planificador Semanal de Escritorio", price: 12.00, quantity: 1 },
        { id: "prod_05", name: "Bolígrafo de Gel Tinta Secado Rápido (Pack 5)", price: 7.50, quantity: 1 }
      ]),
      notes: "",
      created_at: new Date(Date.now() - 5 * 3600000).toISOString()
    },
    {
      id: "ord_1004",
      customer_name: "Elena Morales",
      customer_email: "elena.morales@outlook.com",
      customer_phone: "+34 633 445 566",
      shipping_address: "Calle Betis 9, 41010 Sevilla",
      total: 28.40,
      status: "Pendiente",
      payment_method: "Tarjeta de crédito",
      items_json: JSON.stringify([
        { id: "prod_02", name: "Set de 12 Rotuladores Brush Pastel", price: 14.50, quantity: 1 },
        { id: "prod_08", name: "Libreta de Bolsillo Cuadrícula Dot", price: 11.50, quantity: 1 }
      ]),
      notes: "Urgente para taller escolar.",
      created_at: new Date().toISOString()
    }
  ];

  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, total, status, payment_method, items_json, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const o of orders) {
    insertOrder.run(
      o.id,
      o.customer_name,
      o.customer_email,
      o.customer_phone,
      o.shipping_address,
      o.total,
      o.status,
      o.payment_method,
      o.items_json,
      o.notes,
      o.created_at,
      o.created_at
    );
  }

  logActivity("SEED", "database", "Poblado inicial con catálogo y datos reales de Colorins Papelería Creativa.");
}
