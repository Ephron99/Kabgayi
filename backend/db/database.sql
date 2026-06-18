-- ============================================================
--  DIOCESE DE KABGAYI — Database Schema
--  Database: kabgayi
-- ============================================================

CREATE DATABASE IF NOT EXISTS kabgayi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kabgayi;

-- ── ADMIN USERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('superadmin','admin','editor') DEFAULT 'editor',
  avatar     VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── HERO SLIDES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  badge       VARCHAR(100) NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  title_fr    VARCHAR(200) NOT NULL,
  title_en    VARCHAR(200),
  title_rw    VARCHAR(200),
  desc_fr     TEXT NOT NULL,
  desc_en     TEXT,
  desc_rw     TEXT,
  points_fr   JSON,
  points_en   JSON,
  points_rw   JSON,
  sort_order  INT DEFAULT 0,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── NEWS / ACTUALITÉS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  category_fr  VARCHAR(100),
  category_en  VARCHAR(100),
  category_rw  VARCHAR(100),
  title_fr     VARCHAR(300) NOT NULL,
  title_en     VARCHAR(300),
  title_rw     VARCHAR(300),
  excerpt_fr   TEXT,
  excerpt_en   TEXT,
  excerpt_rw   TEXT,
  content_fr   LONGTEXT,
  content_en   LONGTEXT,
  content_rw   LONGTEXT,
  image_url    VARCHAR(500),
  author_id    INT,
  is_published TINYINT(1) DEFAULT 0,
  published_at DATETIME,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- ── PARISHES / PAROISSES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS parishes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  location    VARCHAR(200),
  vicar       VARCHAR(200),
  phone       VARCHAR(50),
  email       VARCHAR(150),
  image_url   VARCHAR(500),
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── SERVICES DIOCÉSAINS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  section     VARCHAR(50) NOT NULL,
  icon        VARCHAR(10),
  image_url   VARCHAR(500),
  name_fr     VARCHAR(200) NOT NULL,
  name_en     VARCHAR(200),
  name_rw     VARCHAR(200),
  desc_fr     TEXT,
  desc_en     TEXT,
  desc_rw     TEXT,
  sort_order  INT DEFAULT 0,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── DOCUMENTATION ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  type        ENUM('homelie','mwigisha','urumuri','nouvelles') NOT NULL,
  title_fr    VARCHAR(300) NOT NULL,
  title_en    VARCHAR(300),
  title_rw    VARCHAR(300),
  content_fr  LONGTEXT,
  content_en  LONGTEXT,
  content_rw  LONGTEXT,
  file_url    VARCHAR(500),
  image_url   VARCHAR(500),
  author_id   INT,
  is_published TINYINT(1) DEFAULT 1,
  published_at DATETIME,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- ── SETTINGS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  value       TEXT,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── CONTACT MESSAGES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(300),
  message    TEXT NOT NULL,
  is_read    TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── SEED: default admin ───────────────────────────────────────
-- Password: Admin@Kabgayi2024  (bcrypt hash below)
INSERT IGNORE INTO admin_users (name, email, password, role)
VALUES ('Super Admin', 'admin@diocesedekabgayi.org',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh8y',
        'superadmin');

-- ── SEED: default settings ────────────────────────────────────
INSERT IGNORE INTO settings (setting_key, value) VALUES
  ('site_name_fr',   'Diocèse de Kabgayi'),
  ('site_name_en',   'Diocese of Kabgayi'),
  ('site_name_rw',   'Diyosezi ya Kabgayi'),
  ('bishop_name',    'Mgr Balthazar NTIVUGURUZWA'),
  ('bishop_role_fr', 'Évêque du Diocèse de Kabgayi'),
  ('phone',          '+250 788 315 609'),
  ('email',          'info@diocesedekabgayi.org'),
  ('address',        'B.P. 23 Kabgayi – Rwanda'),
  ('facebook',       'https://www.facebook.com/diocesedekabgayi'),
  ('youtube',        'https://www.youtube.com/diocesedekabgayi'),
  ('instagram',      'https://www.instagram.com/diocesedekabgayi');

-- ── SEED: hero slides ─────────────────────────────────────────
INSERT IGNORE INTO hero_slides
  (badge, image_url, title_fr, title_en, title_rw, desc_fr, desc_en, desc_rw, points_fr, points_en, points_rw, sort_order)
VALUES
(
  'DIOCÈSE DE KABGAYI',
  'https://images.unsplash.com/photo-1548625149-720754952028?w=900&q=85',
  'Annoncer le Christ,\nConstruire la Paix.',
  'Proclaiming Christ,\nBuilding Peace.',
  'Gutangaza Kristu,\nOkubaka Amahoro.',
  'Unis dans la foi, nous annonçons l''Évangile, servons nos frères et bâtissons un monde plus juste.',
  'United in faith, we proclaim the Gospel, serve our brothers and sisters.',
  'Hamwe mu kwizera, turatangaza Ubutumwa Bwiza kandi tubaka isi.',
  '["Fondé sur la foi catholique depuis 1912","47 paroisses au service du peuple de Dieu","Présence active dans l''éducation et la santé"]',
  '["Founded on the Catholic faith since 1912","47 parishes serving the people of God","Active presence in education and health"]',
  '["Ishingiye ku kwizera gwa Gatolika kuva 1912","Paruwasi 47 zisukura abantu b''Imana","Irimo mu burezi n''ubuvuzi"]',
  1
),
(
  'PASTORALE',
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=900&q=85',
  'Une Église au Service\nde Tous.',
  'A Church at the Service\nof All.',
  'Itorero Risukura\nBose.',
  'Le Diocèse de Kabgayi accompagne les fidèles dans leur vie spirituelle et sociale.',
  'The Diocese of Kabgayi accompanies the faithful in their spiritual and social life.',
  'Diyosezi ya Kabgayi ifasha abakristu mu buzima bw''ubuzimu n''imibereho.',
  '["Hôpital de Kabgayi au service des malades","Centres de spiritualité et retraites","Caritas pour les plus démunis"]',
  '["Kabgayi Hospital serving the sick","Spirituality centers and retreats","Caritas for the most vulnerable"]',
  '["Ibitaro bya Kabgayi bisukura abarwayi","Ibigo bya spiritualité n''amahugurwa","Caritas ifasha abakene"]',
  2
),
(
  'ÉDUCATION & CULTURE',
  'https://images.unsplash.com/photo-1543652437-15ae418551d7?w=900&q=85',
  'Former les Hommes,\nÉclairer les Esprits.',
  'Educating People,\nEnlightening Minds.',
  'Guhugura Abantu,\nGukangura Ibitekerezo.',
  'À travers l''Institut Catholique et l''Imprimerie de Kabgayi, nous investissons dans l''avenir.',
  'Through the Catholic Institute and Kabgayi Print House, we invest in Rwanda''s future.',
  'Binyuze mu Inshuri Gatolika n''inzego z''ibyapa, tushyira igihugu mu gihe kizaza.',
  '["Institut Catholique de Kabgayi","Réseau d''écoles catholiques","Imprimerie et publication diocésaines"]',
  '["Catholic Institute of Kabgayi","Network of Catholic schools","Diocesan printing and publishing"]',
  '["Inshuri Gatolika ya Kabgayi","Amashuri menshi ya Gatolika","Inzego z''ibyapa na gaseti ya diyosezi"]',
  3
);
