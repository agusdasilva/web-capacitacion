const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken } = require('../middlewares/auth.middleware');

// POST /api/respuestas - Guardar respuestas de un examen
router.post('/respuestas', verificarToken, (req, res) => {
  const usuarioId = req.usuario.id;
  const respuestas = req.body.respuestas; // debe ser un array

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ mensaje: 'Debes enviar al menos una respuesta' });
  }

  let insertadas = 0;

  const examenId = req.body.examen_id;

  if (!examenId) {
    return res.status(400).json({ mensaje: 'Falta el examen_id' });
  }

  // Verificar si ya hizo el examen
  const sqlCheck = `SELECT * FROM resultados WHERE usuario_id = ? AND examen_id = ?`;
  db.query(sqlCheck, [usuarioId, examenId], (errCheck, existing) => {
    if (errCheck) return res.status(500).json({ mensaje: 'Error al verificar resultados' });
    if (existing.length > 0) {
      return res.status(409).json({ mensaje: 'Ya completaste este examen' });
    }

    respuestas.forEach((r, index) => {
      const sql = `INSERT INTO respuestas (usuario_id, pregunta_id, respuesta, tiempo_respuesta) VALUES (?, ?, ?, ?)`;
      db.query(sql, [usuarioId, r.pregunta_id, r.respuesta, r.tiempo_respuesta], (err) => {
        if (err) {
          console.error('❌ Error al guardar respuesta:', err.message);
          return res.status(500).json({ mensaje: 'Error al guardar respuestas' });
        }

        insertadas++;
        if (insertadas === respuestas.length) {
          res.status(201).json({ mensaje: 'Respuestas guardadas correctamente' });
        }
      });
    });
  });
});
module.exports = router;
