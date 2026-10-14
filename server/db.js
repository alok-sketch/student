import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbDir = path.join(__dirname, 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'bazaar.db')
const db = new Database(dbPath)

// Enable foreign keys and WAL mode for high performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_or_phone TEXT UNIQUE NOT NULL,
    college_name TEXT,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    rating REAL DEFAULT 4.8,
    reviews INTEGER DEFAULT 0,
    badge TEXT,
    cover_style TEXT,
    cover_title TEXT,
    description TEXT,
    pages TEXT,
    gsm TEXT,
    binding TEXT,
    ruling TEXT,
    image_type TEXT,
    is_featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    customer_name TEXT,
    contact TEXT,
    hostel_address TEXT,
    subtotal REAL NOT NULL,
    discount_amount REAL NOT NULL DEFAULT 0,
    delivery_fee REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL,
    promo_code TEXT,
    payment_method TEXT DEFAULT 'COD',
    status TEXT DEFAULT 'Confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    cover_style TEXT,
    category TEXT,
    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`)

// Seed products if table is empty
const productCount = db.prepare('SELECT count(*) as count FROM products').get().count
if (productCount === 0) {
  const seedProducts = [
    {
      id: 'nb-1',
      name: 'Motivational Notebook',
      category: 'notebooks',
      price: 70,
      original_price: 99,
      rating: 4.8,
      reviews: 142,
      badge: 'Bestseller',
      cover_style: 'motivational',
      cover_title: 'Believe in Yourself',
      description: 'A5 wire-bound notebook with motivational cover. 160 smooth 80 GSM pages with college ruling.',
      pages: '160 Pages',
      gsm: '80 GSM',
      binding: 'Twin-Wire Spiral',
      ruling: 'Single Ruled',
      image_type: null,
      is_featured: 1,
    },
    {
      id: 'nb-2',
      name: 'Classmate Style Notebook',
      category: 'notebooks',
      price: 65,
      original_price: 85,
      rating: 4.9,
      reviews: 210,
      badge: 'Popular',
      cover_style: 'scenic',
      cover_title: 'Good Things Take Time',
      description: 'Vibrant scenic mountain landscape softcover notebook. Archival grade bright white paper.',
      pages: '180 Pages',
      gsm: '75 GSM',
      binding: 'Spiral Bound',
      ruling: 'Ruled with Date/Page header',
      image_type: null,
      is_featured: 1,
    },
    {
      id: 'nb-3',
      name: 'Kraft Notebook',
      category: 'notebooks',
      price: 60,
      original_price: 80,
      rating: 4.7,
      reviews: 98,
      badge: 'Eco-Friendly',
      cover_style: 'kraft',
      cover_title: 'Small Steps Big Dreams',
      description: 'Rustic recycled kraft paper cover with botanical sketch. Recycled natural unbleached inner sheets.',
      pages: '140 Pages',
      gsm: '85 GSM',
      binding: 'Black Twin-Wire',
      ruling: 'Dot Grid',
      image_type: null,
      is_featured: 1,
    },
    {
      id: 'nb-4',
      name: 'Spiral Notebook (A5)',
      category: 'notebooks',
      price: 80,
      original_price: 110,
      rating: 4.9,
      reviews: 185,
      badge: 'Pro Choice',
      cover_style: 'notes',
      cover_title: 'NOTES',
      description: 'Ultra-minimalist matte black finish with blind debossed typography. Perfect for college lectures.',
      pages: '200 Pages',
      gsm: '90 GSM Ink-Proof',
      binding: 'Heavy Duty Spiral',
      ruling: 'Ruled with Margin',
      image_type: null,
      is_featured: 1,
    },
    {
      id: 'nb-5',
      name: 'Premium Notebook',
      category: 'notebooks',
      price: 90,
      original_price: 130,
      rating: 5.0,
      reviews: 76,
      badge: 'Trending',
      cover_style: 'pastel',
      cover_title: 'Make It Happen',
      description: 'Aesthetic pastel waves with golden spiral rings and high-grade 100 GSM feather-proof paper.',
      pages: '192 Pages',
      gsm: '100 GSM Premium',
      binding: 'Gold Spiral Wire',
      ruling: 'French Ruled / College',
      image_type: null,
      is_featured: 1,
    },
    {
      id: 'pen-1',
      name: 'SmoothFlow 0.5mm Gel Pen Pack (5 Pens)',
      category: 'pens',
      price: 50,
      original_price: 75,
      rating: 4.8,
      reviews: 312,
      badge: 'Hot Deal',
      cover_style: null,
      cover_title: null,
      description: 'Fast drying waterproof Japanese gel ink, zero smudge, ergonomic rubber grip.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'pens',
      is_featured: 0,
    },
    {
      id: 'pen-2',
      name: 'Pastel Aesthetic Dual-Tip Highlighters (Set of 6)',
      category: 'pens',
      price: 120,
      original_price: 160,
      rating: 4.9,
      reviews: 420,
      badge: 'Viral',
      cover_style: null,
      cover_title: null,
      description: 'Soft eye-friendly pastel hues with chisel and fine tips for clean study notes.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'highlighters',
      is_featured: 0,
    },
    {
      id: 'bag-1',
      name: 'Campus Pro Waterproof Laptop Backpack (28L)',
      category: 'bags',
      price: 799,
      original_price: 1299,
      rating: 4.8,
      reviews: 156,
      badge: '1 Year Warranty',
      cover_style: null,
      cover_title: null,
      description: 'Dedicated 15.6" padded laptop sleeve, water-repellent fabric, hidden anti-theft pocket.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'backpack',
      is_featured: 0,
    },
    {
      id: 'calc-1',
      name: 'Scientific Engineering Calculator FX-991EX',
      category: 'calculators',
      price: 950,
      original_price: 1250,
      rating: 4.9,
      reviews: 580,
      badge: 'Exam Approved',
      cover_style: null,
      cover_title: null,
      description: '552 mathematical functions with high-resolution Natural Textbook Display.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'calculator',
      is_featured: 0,
    },
    {
      id: 'bottle-1',
      name: 'Insulated Stainless Steel Sipper Bottle (750ml)',
      category: 'bottles',
      price: 349,
      original_price: 599,
      rating: 4.7,
      reviews: 188,
      badge: 'Keeps Cold 24h',
      cover_style: null,
      cover_title: null,
      description: 'Double-wall vacuum insulation, BPA free, leak-proof sports cap.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'bottle',
      is_featured: 0,
    },
    {
      id: 'stat-1',
      name: 'Geometric Compass & Ruler Math Set in Metal Tin',
      category: 'stationery',
      price: 95,
      original_price: 130,
      rating: 4.6,
      reviews: 89,
      badge: 'Durable',
      cover_style: null,
      cover_title: null,
      description: 'Precision zinc-alloy compass, clear acrylic rulers, protractor, set squares.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'geometry',
      is_featured: 0,
    },
    {
      id: 'ess-1',
      name: 'Sticky Notes & Page Flags Pastel Study Kit',
      category: 'essentials',
      price: 85,
      original_price: 120,
      rating: 4.8,
      reviews: 140,
      badge: 'Must Have',
      cover_style: null,
      cover_title: null,
      description: '500+ colorful index tabs and sticky notes for textbooks and exam prep.',
      pages: null,
      gsm: null,
      binding: null,
      ruling: null,
      image_type: 'stickynotes',
      is_featured: 0,
    },
  ]

  const insertStmt = db.prepare(`
    INSERT INTO products (
      id, name, category, price, original_price, rating, reviews,
      badge, cover_style, cover_title, description, pages, gsm,
      binding, ruling, image_type, is_featured
    ) VALUES (
      @id, @name, @category, @price, @original_price, @rating, @reviews,
      @badge, @cover_style, @cover_title, @description, @pages, @gsm,
      @binding, @ruling, @image_type, @is_featured
    )
  `)

  const insertMany = db.transaction((items) => {
    for (const item of items) insertStmt.run(item)
  })

  insertMany(seedProducts)
  console.log('Seeded initial products into SQLite database')
}

export default db
