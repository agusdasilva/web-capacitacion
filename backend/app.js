const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');



// Configurar variables de entorno
dotenv.config();

// Crear la app
const app = express();

// Middleware para parsear JSON y permitir CORS
app.use(express.json());
app.use(cors());

//Rutas
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);
const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api', usuariosRoutes);
const examenesRoutes = require('./routes/examenes.routes');
app.use('/api', examenesRoutes);
const preguntasRoutes = require('./routes/preguntas.routes');
app.use('/api', preguntasRoutes);
const respuestasRoutes = require('./routes/respuestas.routes');
app.use('/api', respuestasRoutes);
const resultadosRoutes = require('./routes/resultados.routes');
app.use('/api', resultadosRoutes);
const guiasRoutes = require('./routes/guias.routes');
app.use('/api', guiasRoutes);
const videosRoutes = require('./routes/videos.routes');
app.use('/api', videosRoutes);
const forosRoutes = require('./routes/foros.routes');
app.use('/api', forosRoutes);
const estadisticasRoutes = require('./routes/estadisticas.routes');
app.use('/api', estadisticasRoutes);
const guiasVistasRoutes = require('./routes/guias_vistas.routes');
app.use('/api', guiasVistasRoutes);





// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Plataforma de exámenes backend funcionando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
});
