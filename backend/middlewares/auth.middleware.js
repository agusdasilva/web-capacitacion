const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token no enviado' });
  }

  const token = authHeader.split(' ')[1]; // formato "Bearer token"

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });

    req.usuario = decoded; // agregamos los datos al request
    next();
  });
};

const soloAdmins = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
  }
  next();
};

module.exports = { verificarToken, soloAdmins };
