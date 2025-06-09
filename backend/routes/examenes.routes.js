const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/examenes - Ver exámenes disponibles para el usuario
router.get('/examenes', verificarToken, (req, res) => {
  const userId = req.usuario.id;

  const sql = `
    SELECT e.id, e.titulo, e.descripcion, e.duracion_total
    FROM examenes e
    WHERE e.visible_para_usuario = true
    AND e.id NOT IN (
      SELECT examen_id FROM resultados WHERE usuario_id = ?
    )
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener exámenes' });
    res.json(results);
  });
});

// GET /api/examenes/admin - Ver todos los exámenes (solo admin)
router.get('/examenes/admin', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT id, titulo, descripcion, duracion_total, visible_para_usuario, archivo_adjunto
    FROM examenes
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener exámenes' });
    res.json(results);
  });
});

// POST /api/examenes - Crear nuevo examen (admin)
router.post('/examenes', verificarToken, soloAdmins, (req, res) => {
  const { titulo, descripcion, duracion_total, archivo_adjunto, visible_para_usuario } = req.body;

  if (!titulo || !duracion_total) {
    return res.status(400).json({ mensaje: 'Título y duración son obligatorios' });
  }

  const sql = `
    INSERT INTO examenes (titulo, descripcion, duracion_total, archivo_adjunto, visible_para_usuario)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    titulo,
    descripcion || null,
    duracion_total,
    archivo_adjunto || null,
    visible_para_usuario !== undefined ? visible_para_usuario : true
  ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear examen' });

    res.status(201).json({ mensaje: 'Examen creado correctamente' });
  });
});

// PUT /api/examenes/:id - Editar un examen (solo admin)
router.put('/examenes/:id', verificarToken, soloAdmins, (req, res) => {
  const examenId = parseInt(req.params.id);
  const { titulo, descripcion, duracion_total, archivo_adjunto, visible_para_usuario } = req.body;

  if (!titulo || !duracion_total) {
    return res.status(400).json({ mensaje: 'Título y duración son obligatorios' });
  }

  const sql = `
    UPDATE examenes
    SET titulo = ?, descripcion = ?, duracion_total = ?, archivo_adjunto = ?, visible_para_usuario = ?
    WHERE id = ?
  `;

  db.query(sql, [
    titulo,
    descripcion || null,
    duracion_total,
    archivo_adjunto || null,
    visible_para_usuario !== undefined ? visible_para_usuario : true,
    examenId
  ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar el examen' });
    res.json({ mensaje: 'Examen actualizado correctamente' });
  });
});

// DELETE /api/examenes/:id - Ocultar un examen (soft delete, solo admin)
router.delete('/examenes/:id', verificarToken, soloAdmins, (req, res) => {
  const examenId = parseInt(req.params.id);

  const sql = 'UPDATE examenes SET visible_para_usuario = false WHERE id = ?';

  db.query(sql, [examenId], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al ocultar el examen' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Examen no encontrado' });
    }

    res.json({ mensaje: 'Examen ocultado correctamente' });
  });
});


module.exports = router;
