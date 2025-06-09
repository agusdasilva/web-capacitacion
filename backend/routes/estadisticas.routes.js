const express = require('express');
const router = express.Router();
const db = require('../db');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// 🔹 GET:/api/estadisticas/examenes   Exámenes completados por usuario
router.get('/estadisticas/examenes', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT u.id, u.nombre, COUNT(r.id) AS total_examenes
    FROM usuarios u
    LEFT JOIN resultados r ON u.id = r.usuario_id
    GROUP BY u.id
    ORDER BY total_examenes DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener datos' });
    res.json(rows);
  });
});

// 🔹 GET:/api/estadisticas/promedios   Promedio de nota por usuario
router.get('/estadisticas/promedios', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT u.id, u.nombre, ROUND(AVG(r.nota), 2) AS promedio
    FROM usuarios u
    LEFT JOIN resultados r ON u.id = r.usuario_id
    GROUP BY u.id
    ORDER BY promedio DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener promedios' });
    res.json(rows);
  });
});

// 🔹 GET:/api/estadisticas/tiempo   Tiempo total dedicado por usuario
router.get('/estadisticas/tiempo', verificarToken, soloAdmins, (req, res) => {
  const sql = `
    SELECT u.id, u.nombre,
      COALESCE(SUM(r.tiempo_total),0) + COALESCE(SUM(vv.tiempo_reproduccion),0) AS tiempo_total
    FROM usuarios u
    LEFT JOIN resultados r ON u.id = r.usuario_id
    LEFT JOIN vistas_video vv ON u.id = vv.usuario_id
    GROUP BY u.id
    ORDER BY tiempo_total DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener tiempos' });
    res.json(rows);
  });
});

module.exports = router;
