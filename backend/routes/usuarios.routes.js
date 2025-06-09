const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const { verificarToken, soloAdmins } = require('../middlewares/auth.middleware');

// GET /api/usuarios - Listar usuarios activos
router.get('/usuarios', verificarToken, soloAdmins, (req, res) => {
  const sql = 'SELECT id, nombre, email, rol, activo FROM usuarios WHERE activo = true';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// GET /api/perfil - Datos del usuario logueado
router.get('/perfil', verificarToken, (req, res) => {
  const userId = req.usuario.id;

  const sql = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error al buscar el perfil' });

    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(results[0]);
  });
});

// POST /api/usuarios - Crear usuario (admin)
router.post('/usuarios', verificarToken, soloAdmins, async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length > 0) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, hashedPassword, rol], (error) => {
      if (error) return res.status(500).json({ error: 'No se pudo crear el usuario' });

      res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    });
  });
});

// PUT /api/mi-perfil - Modificar perfil del usuario actual
router.put('/mi-perfil', verificarToken, async (req, res) => {
  const userId = req.usuario.id;
  const { nombre, email, password } = req.body;

  if (!nombre && !email && !password) {
    return res.status(400).json({ mensaje: 'Debes enviar al menos un campo para modificar' });
  }

  if (email) {
    const checkSql = 'SELECT * FROM usuarios WHERE email = ? AND id != ?';
    db.query(checkSql, [email, userId], (err, results) => {
      if (err) return res.status(500).json({ mensaje: 'Error al verificar email' });
      if (results.length > 0) {
        return res.status(409).json({ mensaje: 'Ese email ya está en uso por otro usuario' });
      }

      actualizarPerfil(userId, nombre, email, password, res);
    });
  } else {
    actualizarPerfil(userId, nombre, null, password, res);
  }
});

// PUT /api/usuarios/:id - Editar usuario (admin)
router.put('/usuarios/:id', verificarToken, soloAdmins, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { nombre, email, password, rol } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ mensaje: 'ID inválido' });
  }

  const campos = [];
  const valores = [];

  if (nombre) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }

  if (email) {
    campos.push('email = ?');
    valores.push(email);
  }

  if (rol) {
    campos.push('rol = ?');
    valores.push(rol);
  }

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    campos.push('password = ?');
    valores.push(hashed);
  }

  if (campos.length === 0) {
    return res.status(400).json({ mensaje: 'Debés modificar al menos un campo.' });
  }

  valores.push(userId);

  const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;

  db.query(sql, valores, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  });
});


// DELETE /api/usuarios/:id - Desactivar usuario (soft delete)
router.delete('/usuarios/:id', verificarToken, soloAdmins, (req, res) => {
  const userId = parseInt(req.params.id);
  const sql = 'UPDATE usuarios SET activo = false WHERE id = ?';

  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al desactivar usuario' });
    res.json({ mensaje: 'Usuario desactivado correctamente' });
  });
});

// Función auxiliar
async function actualizarPerfil(userId, nombre, email, password, res) {
  const campos = [];
  const valores = [];

  if (nombre) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }

  if (email) {
    campos.push('email = ?');
    valores.push(email);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    campos.push('password = ?');
    valores.push(hashedPassword);
  }

  valores.push(userId);

  const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id = ?`;
  db.query(sql, valores, (err) => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
    res.json({ mensaje: 'Perfil actualizado correctamente' });
  });
}

module.exports = router;
