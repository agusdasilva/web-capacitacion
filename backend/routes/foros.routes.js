const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/foros - Ver todos los foros
router.get('/foros', verificarToken, (req, res) => {
  const sql = `
    SELECT f.id, f.titulo, f.mensaje, f.fecha, f.habilitado_respuestas, u.nombre AS autor
    FROM foros f
    JOIN usuarios u ON f.autor_id = u.id
    ORDER BY f.fecha DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener foros' });
    res.json(results);
  });
});

// POST /api/foros - Crear nuevo foro (solo admin)
router.post('/foros', verificarToken, soloAdmins, (req, res) => {
  const { titulo, mensaje, habilitado_respuestas } = req.body;
  const autor_id = req.usuario.id;

  if (!titulo || !mensaje) {
    return res.status(400).json({ mensaje: 'Título y mensaje son obligatorios' });
  }

  const sql = `
    INSERT INTO foros (titulo, mensaje, autor_id, habilitado_respuestas)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, mensaje, autor_id, habilitado_respuestas || false], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear foro' });
    res.status(201).json({ mensaje: 'Foro creado correctamente' });
  });
});

// GET /api/foros/:id/respuestas - Ver respuestas de un foro
router.get('/foros/:id/respuestas', verificarToken, (req, res) => {
  const sql = `
    SELECT r.id, r.mensaje, r.fecha, u.nombre AS autor
    FROM respuestas_foro r
    JOIN usuarios u ON r.autor_id = u.id
    WHERE r.foro_id = ?
    ORDER BY r.fecha ASC
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener respuestas' });
    res.json(results);
  });
});

// POST /api/foros/:id/respuestas - Agregar respuesta a un foro
router.post('/foros/:id/respuestas', verificarToken, (req, res) => {
  const { mensaje } = req.body;
  const foro_id = req.params.id;
  const autor_id = req.usuario.id;

  if (!mensaje) return res.status(400).json({ mensaje: 'Mensaje obligatorio' });

  // Verificar si el foro permite respuestas
  db.query('SELECT habilitado_respuestas FROM foros WHERE id = ?', [foro_id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar foro' });
    if (result.length === 0) return res.status(404).json({ mensaje: 'Foro no encontrado' });
    if (!result[0].habilitado_respuestas) {
      return res.status(403).json({ mensaje: 'Este foro no permite respuestas' });
    }

    const sql = `
      INSERT INTO respuestas_foro (foro_id, autor_id, mensaje)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [foro_id, autor_id, mensaje], (err2) => {
      if (err2) return res.status(500).json({ mensaje: 'Error al enviar respuesta' });
      res.status(201).json({ mensaje: 'Respuesta publicada' });
    });
  });
});
 
// PUT /api/foros/:id - Editar foro (solo admin)
router.put('/foros/:id', verificarToken, soloAdmins, (req, res) => {
  const foroId = parseInt(req.params.id);
  const { titulo, mensaje, imagen, habilitado_respuestas } = req.body;

  if (!titulo || !mensaje) {
    return res.status(400).json({ mensaje: 'Título y mensaje son obligatorios' });
  }

  const sql = `
    UPDATE foros
    SET titulo = ?, mensaje = ?, imagen = ?, habilitado_respuestas = ?
    WHERE id = ?
  `;

  db.query(sql, [
    titulo,
    mensaje,
    imagen || null,
    habilitado_respuestas !== undefined ? habilitado_respuestas : false,
    foroId
  ], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al editar el foro' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Foro no encontrado' });
    }
    res.json({ mensaje: 'Foro actualizado correctamente' });
  });
});

// DELETE /api/foros/:id - Eliminar foro (solo admin)
router.delete('/foros/:id', verificarToken, soloAdmins, (req, res) => {
  const foroId = parseInt(req.params.id);

  db.query('DELETE FROM foros WHERE id = ?', [foroId], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar el foro' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Foro no encontrado' });
    }
    res.json({ mensaje: 'Foro eliminado correctamente' });
  });
});

module.exports = router;
