/**
 * Generates a phpMyAdmin-importable SQL file for the "À Propos" tables,
 * using the exact same seed data as migrate-about.js.
 *
 * Run: node db/generate-about-sql.js   (from the backend folder)
 * Output: db/about.sql
 */
const fs   = require("fs");
const path = require("path");
const { CONTENT, STATS, COLLABORATORS } = require("./migrate-about");

// Escape a value into a MySQL string literal (backslash escaping, as phpMyAdmin expects).
const esc = (v) => {
  if (v === null || v === undefined || v === "") return "NULL";
  return "'" + String(v)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, "\\n") + "'";
};

const contentCols = Object.keys(CONTENT);

const parts = [];
parts.push("-- À Propos page: tables + seed data");
parts.push("-- Import via cPanel → phpMyAdmin → your database → Import tab.");
parts.push("-- Safe to run when these tables do not exist yet. Generated file — do not edit by hand.");
parts.push("");
parts.push("SET NAMES utf8mb4;");
parts.push("");

// ── Tables ──
parts.push(`CREATE TABLE IF NOT EXISTS about_content (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  hero_title_fr        VARCHAR(300), hero_title_en VARCHAR(300), hero_title_rw VARCHAR(300),
  hero_subtitle_fr     VARCHAR(300), hero_subtitle_en VARCHAR(300), hero_subtitle_rw VARCHAR(300),
  diocese_tab_fr       VARCHAR(120), diocese_tab_en VARCHAR(120), diocese_tab_rw VARCHAR(120),
  bishop_tab_fr        VARCHAR(120), bishop_tab_en VARCHAR(120), bishop_tab_rw VARCHAR(120),
  diocese_title_fr     VARCHAR(300), diocese_title_en VARCHAR(300), diocese_title_rw VARCHAR(300),
  diocese_text_fr      LONGTEXT, diocese_text_en LONGTEXT, diocese_text_rw LONGTEXT,
  diocese_image        VARCHAR(500),
  stats_title_fr       VARCHAR(200), stats_title_en VARCHAR(200), stats_title_rw VARCHAR(200),
  stats_designation_fr VARCHAR(120), stats_designation_en VARCHAR(120), stats_designation_rw VARCHAR(120),
  stats_figure_fr      VARCHAR(120), stats_figure_en VARCHAR(120), stats_figure_rw VARCHAR(120),
  bishop_title_fr      VARCHAR(200), bishop_title_en VARCHAR(200), bishop_title_rw VARCHAR(200),
  bishop_role_fr       VARCHAR(200), bishop_role_en VARCHAR(200), bishop_role_rw VARCHAR(200),
  bishop_text_fr       LONGTEXT, bishop_text_en LONGTEXT, bishop_text_rw LONGTEXT,
  bishop_image         VARCHAR(500),
  collab_title_fr      VARCHAR(200), collab_title_en VARCHAR(200), collab_title_rw VARCHAR(200),
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
parts.push("");
parts.push(`CREATE TABLE IF NOT EXISTS about_stats (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label_fr   VARCHAR(255), label_en VARCHAR(255), label_rw VARCHAR(255),
  value      VARCHAR(120),
  is_section TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
parts.push("");
parts.push(`CREATE TABLE IF NOT EXISTS about_collaborators (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200),
  role_fr    VARCHAR(200), role_en VARCHAR(200), role_rw VARCHAR(200),
  sort_order INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
parts.push("");

// ── Seed content (single row) ──
parts.push(`INSERT INTO about_content (${contentCols.join(", ")})
VALUES (${contentCols.map((c) => esc(CONTENT[c])).join(", ")});`);
parts.push("");

// ── Seed stats ──
STATS.forEach((s, i) => {
  parts.push(
    `INSERT INTO about_stats (label_fr, label_en, label_rw, value, is_section, sort_order) VALUES ` +
    `(${esc(s.label_fr)}, ${esc(s.label_en)}, ${esc(s.label_rw)}, ${esc(s.value)}, ${s.is_section ? 1 : 0}, ${i + 1});`
  );
});
parts.push("");

// ── Seed collaborators ──
COLLABORATORS.forEach((p, i) => {
  parts.push(
    `INSERT INTO about_collaborators (name, role_fr, role_en, role_rw, sort_order) VALUES ` +
    `(${esc(p.name)}, ${esc(p.role_fr)}, ${esc(p.role_en)}, ${esc(p.role_rw)}, ${i + 1});`
  );
});
parts.push("");

const out = path.join(__dirname, "about.sql");
fs.writeFileSync(out, parts.join("\n"), "utf8");
console.log("✅  Written:", out);
console.log(`    ${contentCols.length} content columns, ${STATS.length} stats, ${COLLABORATORS.length} collaborators`);
