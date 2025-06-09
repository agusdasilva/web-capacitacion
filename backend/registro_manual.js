const bcrypt = require('bcryptjs');
const db = require('./db');

const nombre = 'Agustin';
const email = 'agustin2@mail.com';
const passwordPlano = '1234';
const rol = 'admin';

bcrypt.hash(passwordPlano, 10, (err, hash) => {
  if (err) throw err;

  const sql = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, email, hash, rol], (error, result) => {
    if (error) throw error;
    console.log('✅ Usuario insertado con contraseña cifrada');
    process.exit();
  });
});
