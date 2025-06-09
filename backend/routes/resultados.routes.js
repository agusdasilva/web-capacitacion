const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken } = require('../middlewares/auth.middleware');

// GET /api/resultados/mios - Ver mis resultados
router.get('/resultados/mios', verificarToken, (req, res) => {
  const usuarioId = req.usuario.id;

  const sql = `
    SELECT r.id, e.titulo, r.nota, r.tiempo_total, r.fecha
    FROM resultados r
    JOIN examenes e ON r.examen_id = e.id
    WHERE r.usuario_id = ? AND r.visible_para_usuario = true
    ORDER BY r.fecha DESC
  `;

  db.query(sql, [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener resultados' });

    res.json(results);
  });
});

// POST /api/resultados - Calcular nota y guardar resultado
router.post('/resultados', verificarToken, (req, res) => {
  const usuarioId = req.usuario.id;
  const { examen_id } = req.body;

  if (!examen_id) {
    return res.status(400).json({ mensaje: 'El examen_id es obligatorio' });
  }

  // Verificar si ya existe resultado
  const verificarSql = `
    SELECT id FROM resultados
    WHERE usuario_id = ? AND examen_id = ?
  `;

  db.query(verificarSql, [usuarioId, examen_id], (errVerif, existing) => {
    if (errVerif) return res.status(500).json({ mensaje: 'Error al verificar duplicado' });

    if (existing.length > 0) {
      return res.status(409).json({ mensaje: 'Ya has completado este examen' });
    }

    // Obtener respuestas del usuario para ese examen
    const sqlRespuestas = `
      SELECT r.*, p.respuesta_correcta
      FROM respuestas r
      JOIN preguntas p ON r.pregunta_id = p.id
      WHERE r.usuario_id = ? AND p.examen_id = ?
    `;

    db.query(sqlRespuestas, [usuarioId, examen_id], (err, respuestas) => {
      if (err) return res.status(500).json({ mensaje: 'Error al obtener respuestas' });
      if (respuestas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron respuestas para ese examen' });
      }

      const total = respuestas.length;
      const correctas = respuestas.filter(r => r.respuesta === r.respuesta_correcta).length;
      const nota = parseFloat(((correctas / total) * 10).toFixed(2));
      const tiempo_total = respuestas.reduce((acc, r) => acc + r.tiempo_respuesta, 0);

      const sqlInsert = `
        INSERT INTO resultados (examen_id, usuario_id, nota, tiempo_total)
        VALUES (?, ?, ?, ?)
      `;

      db.query(sqlInsert, [examen_id, usuarioId, nota, tiempo_total], (err2) => {
        if (err2) return res.status(500).json({ mensaje: 'Error al guardar el resultado final' });

        res.status(201).json({
          mensaje: 'Resultado guardado',
          nota,
          tiempo_total,
          total_preguntas: total,
          correctas
        });
      });
    });
  });
});

module.exports = router;
