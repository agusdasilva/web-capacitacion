const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/guias - Ver guías visibles para los usuarios
router.get('/guias', verificarToken, (req, res) => {
  const sql = `
    SELECT id, titulo, descripcion, archivo
    FROM guias
    WHERE visible_para_usuario = true
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener guías' });
    res.json(results);
  });
});

// GET /api/guias/admin - Ver todas las guías (solo admin)
router.get('/guias/admin', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT id, titulo, descripcion, archivo, examen_id, visible_para_usuario
    FROM guias
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener guías (admin)' });
    res.json(results);
  });
});

// POST /api/guias - Crear una nueva guía (solo admin)
router.post('/guias', verificarToken, soloAdmins, (req, res) => {
  const { titulo, descripcion, archivo, examen_id, visible_para_usuario } = req.body;

  if (!titulo || !archivo) {
    return res.status(400).json({ mensaje: 'Título y archivo son obligatorios' });
  }

  if (examen_id && isNaN(parseInt(examen_id))) {
    return res.status(400).json({ mensaje: 'El examen_id debe ser un número o null' });
  }

  const sql = `
    INSERT INTO guias (titulo, descripcion, archivo, examen_id, visible_para_usuario)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    titulo,
    descripcion || null,
    archivo,
    examen_id || null,
    visible_para_usuario !== undefined ? visible_para_usuario : true
  ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear la guía' });
    res.status(201).json({ mensaje: 'Guía creada correctamente' });
  });
});

// PUT /api/guias/:id - Editar una guía (admin)
router.put('/guias/:id', verificarToken, soloAdmins, (req, res) => {
  const guiaId = parseInt(req.params.id);
  const { titulo, descripcion, archivo, examen_id, visible_para_usuario } = req.body;

  if (!titulo || !archivo) {
    return res.status(400).json({ mensaje: 'Título y archivo son obligatorios' });
  }

  const sql = `
    UPDATE guias
    SET titulo = ?, descripcion = ?, archivo = ?, examen_id = ?, visible_para_usuario = ?
    WHERE id = ?
  `;

  db.query(sql, [
    titulo,
    descripcion || null,
    archivo,
    examen_id || null,
    visible_para_usuario !== undefined ? visible_para_usuario : true,
    guiaId
  ], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al editar la guía' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Guía no encontrada' });
    }
    res.json({ mensaje: 'Guía actualizada correctamente' });
  });
});

// DELETE /api/guias/:id - Ocultar una guía (soft delete, solo admin)
router.delete('/guias/:id', verificarToken, soloAdmins, (req, res) => {
  const guiaId = parseInt(req.params.id);

  if (isNaN(guiaId)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  const sql = 'UPDATE guias SET visible_para_usuario = false WHERE id = ?';

  db.query(sql, [guiaId], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al ocultar la guía' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Guía no encontrada' });
    }
    res.json({ mensaje: 'Guía ocultada correctamente' });
  });
});

module.exports = router;

