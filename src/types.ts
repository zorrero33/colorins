
export type Section = any;

export type Product = {
  id?: any;
  slug?: any;
  name?: any;
  price?: any;
  compareAt?: any;
  old_price?: any;
  category?: any;
  emoji?: any;
  isFeatured?: any;
  featured?: any;
  isNew?: any;
  stock?: any;
  description?: any;
  brand?: any;
  sku?: any;
  active?: any;
  tone?: any;
  tax?: any;
  weight?: any;
  image_url?: any;
  [key: string]: any;
};

export type Business = {
  id?: any;
  name?: any;
  description?: any;
  address?: any;
  phone?: any;
  email?: any;
  website?: any;
  [key: string]: any;
};

export type OpeningHour = {
  day?: any;
  open?: any;
  close?: any;
  value?: any;
  closed?: any;
  [key: string]: any;
};

export type Service = {
  id?: any;
  name?: any;
  description?: any;
  price?: any;
  slug?: any;
  emoji?: any;
  enabled?: any;
  [key: string]: any;
};

export type Category = {
  id?: any;
  name?: any;
  slug?: any;
  emoji?: any;
  tone?: any;
  active?: any;
  product_count?: any;
  [key: string]: any;
};

export type Customer = {
  id?: any;
  name?: any;
  email?: any;
  phone?: any;
  address?: any;
  total_spent?: any;
  orders_count?: any;
  created_at?: any;
  active?: any;
  [key: string]: any;
};

export type Order = {
  id?: any;
  customerId?: any;
  customerName?: any;
  customer_name?: any;
  customer_email?: any;
  customer_phone?: any;
  shipping_address?: any;
  payment_method?: any;
  status?: any;
  total?: any;
  items?: any;
  items_json?: any;
  notes?: any;
  created_at?: any;
  [key: string]: any;
};

export type InventoryItem = Product;

export type Log = {
  id?: any;
  message?: any;
  level?: any;
  createdAt?: any;
  created_at?: any;
  action?: any;
  description?: any;
  table_name?: any;
  user?: any;
  [key: string]: any;
};

export type LogEntry = Log;

export type SiteSettings = {
  [key: string]: any;
};

export type DesignSettings = {
  [key: string]: any;
};

export type SEOSettings = {
  [key: string]: any;
};

export type LegalSettings = {
  [key: string]: any;
};

export type SecurityStatus = {
  [key: string]: any;
};

export type DatabaseStatus = {
  counts?: any;
  sizeKb?: any;
  [key: string]: any;
};

export type Settings = {
  [key: string]: any;
};

export type SecuritySettings = {
  [key: string]: any;
};
