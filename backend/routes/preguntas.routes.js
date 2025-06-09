const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/examenes/:id/preguntas - Ver preguntas de un examen
router.get('/examenes/:id/preguntas', verificarToken, (req, res) => {
  const examenId = parseInt(req.params.id);

  if (isNaN(examenId)) {
    return res.status(400).json({ mensaje: 'ID de examen inválido' });
  }

  db.query('SELECT id FROM examenes WHERE id = ?', [examenId], (err, examen) => {
    if (err) return res.status(500).json({ mensaje: 'Error al verificar examen' });
    if (examen.length === 0) {
      return res.status(404).json({ mensaje: 'El examen no existe' });
    }

    const sql = 'SELECT id, texto, opciones, tiempo_maximo FROM preguntas WHERE examen_id = ?';
    db.query(sql, [examenId], (err2, results) => {
      if (err2) return res.status(500).json({ mensaje: 'Error al obtener preguntas' });

      if (results.length === 0) {
        return res.status(404).json({ mensaje: 'Este examen no tiene preguntas aún' });
      }

      const preguntas = results.map(p => {
        let opciones;
      
        if (typeof p.opciones === 'string') {
          try {
            opciones = JSON.parse(p.opciones);
          } catch (e) {
            console.error(`Error al parsear opciones de pregunta ID ${p.id}:`, p.opciones);
            opciones = [];
          }
        } else if (Array.isArray(p.opciones)) {
          opciones = p.opciones; // ya viene bien
        } else {
          opciones = [];
        }
      
        return {
          id: p.id,
          texto: p.texto,
          opciones,
          tiempo_maximo: p.tiempo_maximo ?? null
        };
      });
      
      
      

      res.json(preguntas);
    });
  });
});

// POST /api/examenes/:id/preguntas - Agregar una pregunta (solo admin)
router.post('/examenes/:id/preguntas', verificarToken, soloAdmins, (req, res) => {
  const examenId = parseInt(req.params.id);
  const { texto, opciones, respuesta_correcta, tiempo_maximo } = req.body;

  if (!texto || !Array.isArray(opciones) || opciones.length < 2 || !respuesta_correcta) {
    return res.status(400).json({ mensaje: 'Debe ingresar el texto, al menos 2 opciones y una respuesta correcta.' });
  }

  if (!opciones.includes(respuesta_correcta)) {
    return res.status(400).json({ mensaje: 'La respuesta correcta debe estar dentro de las opciones.' });
  }

  const sql = `
    INSERT INTO preguntas (examen_id, texto, opciones, respuesta_correcta, tiempo_maximo)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    examenId,
    texto,
    JSON.stringify(opciones),
    respuesta_correcta,
    tiempo_maximo || null
  ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al guardar la pregunta' });
    res.status(201).json({ mensaje: 'Pregunta agregada correctamente' });
  });
});

// PUT /api/preguntas/:id - Editar una pregunta (solo admin)
router.put('/preguntas/:id', verificarToken, soloAdmins, (req, res) => {
  const preguntaId = parseInt(req.params.id);
  const { texto, opciones, respuesta_correcta, tiempo_maximo } = req.body;

  if (isNaN(preguntaId)) {
    return res.status(400).json({ mensaje: 'ID de pregunta inválido' });
  }

  if (!texto || !Array.isArray(opciones) || opciones.length < 2 || !respuesta_correcta) {
    return res.status(400).json({ mensaje: 'Debe ingresar el texto, al menos 2 opciones y una respuesta correcta.' });
  }

  if (!opciones.includes(respuesta_correcta)) {
    return res.status(400).json({ mensaje: 'La respuesta correcta debe estar dentro de las opciones.' });
  }

  const sql = `
    UPDATE preguntas
    SET texto = ?, opciones = ?, respuesta_correcta = ?, tiempo_maximo = ?
    WHERE id = ?
  `;

  db.query(sql, [
    texto,
    JSON.stringify(opciones),
    respuesta_correcta,
    tiempo_maximo || null,
    preguntaId
  ], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar la pregunta' });
    res.json({ mensaje: 'Pregunta actualizada correctamente' });
  });
});

// DELETE /api/preguntas/:id - Eliminar una pregunta (solo admin)
router.delete('/preguntas/:id', verificarToken, soloAdmins, (req, res) => {
  const preguntaId = parseInt(req.params.id);

  if (isNaN(preguntaId)) {
    return res.status(400).json({ mensaje: 'ID de pregunta inválido' });
  }

  db.query('DELETE FROM preguntas WHERE id = ?', [preguntaId], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar la pregunta' });
    res.json({ mensaje: 'Pregunta eliminada correctamente' });
  });
});

module.exports = router;

