console.log("📦 auth.routes.js cargado");

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Configuración de intentos fallidos
const intentosFallidos = {}; // { email: { intentos: X, bloqueado_hasta: timestamp } }
const BLOQUEO_MINUTOS = 5;
const MAX_INTENTOS = 10;

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña obligatorios' });
  }

  const ahora = Date.now();

  // Validar si el usuario está bloqueado
  if (intentosFallidos[email] && intentosFallidos[email].bloqueado_hasta > ahora) {
    const espera = Math.ceil((intentosFallidos[email].bloqueado_hasta - ahora) / 1000);
    return res.status(429).json({
      mensaje: `Demasiados intentos fallidos. Esperá ${espera} segundos para volver a intentar.`
    });
  }

  // Buscar usuario en la base de datos
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar contraseña
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      intentosFallidos[email] = intentosFallidos[email] || { intentos: 0, bloqueado_hasta: 0 };
      intentosFallidos[email].intentos += 1;

      if (intentosFallidos[email].intentos >= MAX_INTENTOS) {
        intentosFallidos[email].bloqueado_hasta = ahora + BLOQUEO_MINUTOS * 60 * 1000;
        intentosFallidos[email].intentos = 0;

        return res.status(429).json({
          mensaje: `Demasiados intentos fallidos. Esperá ${BLOQUEO_MINUTOS} minutos para volver a intentar.`
        });
      }

      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Login correcto: eliminar intentos fallidos
    if (intentosFallidos[email]) {
      delete intentosFallidos[email];
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  });
});

module.exports = router;
