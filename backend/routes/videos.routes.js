const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/videos - Ver todos los videos disponibles
router.get('/videos', verificarToken, (req, res) => {
  const sql = 'SELECT id, titulo, url, duracion FROM videos';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener videos' });
    res.json(results);
  });
});

// GET /api/videos/admin - Ver todos los videos (admin)
router.get('/videos/admin', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT id, titulo, descripcion, url, duracion, examen_id, visible_para_usuario
    FROM videos
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener videos' });
    res.json(results);
  });
});

// GET /api/videos/vistos - Historial del usuario
router.get('/videos/vistos', verificarToken, (req, res) => {
  const usuario_id = req.usuario.id;

  const sql = `
    SELECT vv.id, v.titulo, v.url, vv.tiempo_reproduccion, vv.fecha
    FROM vistas_video vv
    JOIN videos v ON vv.video_id = v.id
    WHERE vv.usuario_id = ?
    ORDER BY vv.fecha DESC
  `;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener historial de videos' });
    res.json(results);
  });
});


// POST /api/videos - Subir un nuevo video (solo admin)
router.post('/videos', verificarToken, soloAdmins, (req, res) => {
  const { titulo, descripcion, url, duracion, examen_id } = req.body;

  if (!titulo || !url || !duracion) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const sql = 'INSERT INTO videos (titulo, descripcion, url, duracion, examen_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [titulo, descripcion, url, duracion, examen_id || null], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear video' });
    res.status(201).json({ mensaje: 'Video cargado correctamente' });
  });
});

// POST /api/videos/visto - Registrar reproducción (usuario)
router.post('/videos/visto', verificarToken, (req, res) => {
  const { video_id, tiempo_reproduccion } = req.body;
  const usuario_id = req.usuario.id;

  if (!video_id || !tiempo_reproduccion) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const sql = 'INSERT INTO vistas_video (video_id, usuario_id, tiempo_reproduccion) VALUES (?, ?, ?)';
  db.query(sql, [video_id, usuario_id, tiempo_reproduccion], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al registrar la visualización' });
    res.status(201).json({ mensaje: 'Visualización registrada' });
  });
});

// PUT /api/videos/:id - Editar un video (solo admin)
router.put('/videos/:id', verificarToken, soloAdmins, (req, res) => {
  const videoId = parseInt(req.params.id);
  const { titulo, descripcion, url, duracion, examen_id, visible_para_usuario } = req.body;

  if (!titulo || !url || !duracion) {
    return res.status(400).json({ mensaje: 'Título, URL y duración son obligatorios' });
  }

  const sql = `
    UPDATE videos
    SET titulo = ?, descripcion = ?, url = ?, duracion = ?, examen_id = ?, visible_para_usuario = ?
    WHERE id = ?
  `;

  db.query(sql, [
    titulo,
    descripcion || null,
    url,
    duracion,
    examen_id || null,
    visible_para_usuario !== undefined ? visible_para_usuario : true,
    videoId
  ], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al editar el video' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Video no encontrado' });
    }
    res.json({ mensaje: 'Video actualizado correctamente' });
  });
});

// DELETE /api/videos/:id - Ocultar video (soft delete, solo admin)
router.delete('/videos/:id', verificarToken, soloAdmins, (req, res) => {
  const videoId = parseInt(req.params.id);

  const sql = 'UPDATE videos SET visible_para_usuario = false WHERE id = ?';

  db.query(sql, [videoId], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al ocultar el video' });
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Video no encontrado' });
    }
    res.json({ mensaje: 'Video ocultado correctamente' });
  });
});

module.exports = router;
