const express = require("express");
const router = express.Router();
const connection = require("../db/connection");

// Get all active pastoral items (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM pastoral_items WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single pastoral item by slug (public)
router.get("/slug/:slug", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM pastoral_items WHERE slug = ? AND is_active = 1",
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all pastoral items (admin)
router.get("/admin", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM pastoral_items ORDER BY sort_order ASC, id ASC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create pastoral item (admin)
router.post("/", async (req, res) => {
  try {
    const {
      parent_id,
      slug,
      name_fr,
      name_en,
      name_rw,
      image_url,
      moto_fr,
      moto_en,
      moto_rw,
      saint_patron_fr,
      saint_patron_en,
      saint_patron_rw,
      date_fondation,
      directeur_name_fr,
      directeur_name_en,
      directeur_name_rw,
      directeur_contact,
      sort_order,
      is_active
    } = req.body;

    const [result] = await connection.query(
      `INSERT INTO pastoral_items 
       (parent_id, slug, name_fr, name_en, name_rw, image_url, moto_fr, moto_en, moto_rw, saint_patron_fr, saint_patron_en, saint_patron_rw, date_fondation, directeur_name_fr, directeur_name_en, directeur_name_rw, directeur_contact, sort_order, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id || null,
        slug,
        name_fr,
        name_en || null,
        name_rw || null,
        image_url || null,
        moto_fr || null,
        moto_en || null,
        moto_rw || null,
        saint_patron_fr || null,
        saint_patron_en || null,
        saint_patron_rw || null,
        date_fondation || null,
        directeur_name_fr || null,
        directeur_name_en || null,
        directeur_name_rw || null,
        directeur_contact || null,
        sort_order || 0,
        is_active !== undefined ? is_active : 1
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pastoral item (admin)
router.put("/:id", async (req, res) => {
  try {
    const {
      parent_id,
      slug,
      name_fr,
      name_en,
      name_rw,
      image_url,
      moto_fr,
      moto_en,
      moto_rw,
      saint_patron_fr,
      saint_patron_en,
      saint_patron_rw,
      date_fondation,
      directeur_name_fr,
      directeur_name_en,
      directeur_name_rw,
      directeur_contact,
      sort_order,
      is_active
    } = req.body;

    await connection.query(
      `UPDATE pastoral_items 
       SET parent_id=?, slug=?, name_fr=?, name_en=?, name_rw=?, image_url=?, moto_fr=?, moto_en=?, moto_rw=?, saint_patron_fr=?, saint_patron_en=?, saint_patron_rw=?, date_fondation=?, directeur_name_fr=?, directeur_name_en=?, directeur_name_rw=?, directeur_contact=?, sort_order=?, is_active=? 
       WHERE id=?`,
      [
        parent_id || null,
        slug,
        name_fr,
        name_en || null,
        name_rw || null,
        image_url || null,
        moto_fr || null,
        moto_en || null,
        moto_rw || null,
        saint_patron_fr || null,
        saint_patron_en || null,
        saint_patron_rw || null,
        date_fondation || null,
        directeur_name_fr || null,
        directeur_name_en || null,
        directeur_name_rw || null,
        directeur_contact || null,
        sort_order || 0,
        is_active !== undefined ? is_active : 1,
        req.params.id
      ]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete pastoral item (admin)
router.delete("/:id", async (req, res) => {
  try {
    await connection.query("DELETE FROM pastoral_items WHERE id = ?", [req.params.id]);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;