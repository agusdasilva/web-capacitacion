const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/notificaciones - Ver mis notificaciones
router.get('/notificaciones', verificarToken, (req, res) => {
  const usuarioId = req.usuario.id;

  const sql = `
    SELECT id, mensaje, leida, fecha
    FROM notificaciones
    WHERE usuario_id = ?
    ORDER BY fecha DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener notificaciones' });
    res.json(results);
  });
});

// POST /api/notificaciones - Enviar notificación a un usuario (solo admin)
router.post('/notificaciones', verificarToken, soloAdmins, (req, res) => {
  const { usuario_id, mensaje } = req.body;

  if (!usuario_id || !mensaje) {
    return res.status(400).json({ mensaje: 'Usuario y mensaje son obligatorios' });
  }

  const sql = `
    INSERT INTO notificaciones (usuario_id, mensaje)
    VALUES (?, ?)
  `;

  db.query(sql, [usuario_id, mensaje], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al enviar notificación' });
    res.status(201).json({ mensaje: 'Notificación enviada correctamente' });
  });
});

// PUT /api/notificaciones/:id/leida - Marcar como leída
router.put('/notificaciones/:id/leida', verificarToken, (req, res) => {
  const notifId = parseInt(req.params.id);
  const usuarioId = req.usuario.id;

  const sql = `
    UPDATE notificaciones
    SET leida = true
    WHERE id = ? AND usuario_id = ?
  `;

  db.query(sql, [notifId, usuarioId], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar notificación' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada o no autorizada' });
    }
    res.json({ mensaje: 'Notificación marcada como leída' });
  });
});

 // DELETE /api/notificaciones/:id - Eliminar una notificación (usuario)
router.delete('/notificaciones/:id', verificarToken, (req, res) => {
    const notifId = parseInt(req.params.id);
    const usuarioId = req.usuario.id;
  
    const sql = `
      DELETE FROM notificaciones
      WHERE id = ? AND usuario_id = ?
    `;
  
    db.query(sql, [notifId, usuarioId], (err, result) => {
      if (err) return res.status(500).json({ mensaje: 'Error al eliminar notificación' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Notificación no encontrada o no autorizada' });
      }
      res.json({ mensaje: 'Notificación eliminada correctamente' });
    });
  });
  
module.exports = router;
