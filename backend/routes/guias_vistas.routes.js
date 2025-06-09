const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken } = require('../middlewares/auth.middleware');

// POST /api/guias/vista - Registrar vista de una guía
router.post('/guias/vista', verificarToken, (req, res) => {
  const { guia_id } = req.body;
  const usuario_id = req.usuario.id;

  if (!guia_id) {
    return res.status(400).json({ mensaje: 'ID de guía obligatorio' });
  }

  const sql = `
    INSERT INTO guias_vistas (guia_id, usuario_id)
    VALUES (?, ?)
  `;

  db.query(sql, [guia_id, usuario_id], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al registrar la vista' });
    res.status(201).json({ mensaje: 'Vista registrada correctamente' });
  });
});

// GET /api/guias/vistas - Ver historial del usuario
router.get('/guias/vistas', verificarToken, (req, res) => {
  const usuario_id = req.usuario.id;

  const sql = `
    SELECT gv.id, g.titulo, g.descripcion, g.archivo, gv.fecha
    FROM guias_vistas gv
    JOIN guias g ON gv.guia_id = g.id
    WHERE gv.usuario_id = ?
    ORDER BY gv.fecha DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener historial de guías' });
    res.json(results);
  });
});

module.exports = router;
