CREATE DATABASE IF NOT EXISTS plataforma_examenes;
USE plataforma_examenes;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'vendedor') DEFAULT 'vendedor'
);

INSERT INTO usuarios (nombre, email, password, rol)
VALUES ('Agustin', 'agustin@mail.com', '1234', 'admin');

CREATE USER 'agustin'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON plataforma_examenes.* TO 'agustin'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS examenes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  duracion_total INT NOT NULL, -- en segundos
  archivo_adjunto VARCHAR(255), -- puede ser NULL
  visible_para_usuario BOOLEAN DEFAULT TRUE
);

INSERT INTO examenes (titulo, descripcion, duracion_total)
VALUES ('Examen de Bienvenida', 'Introductorio para nuevos vendedores', 600);

CREATE TABLE IF NOT EXISTS preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  texto TEXT NOT NULL,
  opciones JSON NOT NULL,
  respuesta_correcta VARCHAR(255) NOT NULL,
  tiempo_maximo INT NOT NULL, -- en segundos
  FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE CASCADE
);

INSERT INTO preguntas (examen_id, texto, opciones, respuesta_correcta, tiempo_maximo)
VALUES (
  1,
  '¿Cuál es el paso inicial para abordar a un cliente?',
  JSON_ARRAY('Saludar con entusiasmo', 'Ofrecer descuentos', 'Preguntar si busca algo', 'Quedarse en silencio'),
  'Saludar con entusiasmo',
  60
);

ALTER TABLE preguntas MODIFY tiempo_maximo INT NULL;

CREATE TABLE IF NOT EXISTS respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  pregunta_id INT NOT NULL,
  respuesta TEXT NOT NULL,
  tiempo_respuesta INT NOT NULL, -- tiempo que tardó en responder (en segundos)
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);

CREATE TABLE IF NOT EXISTS resultados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  examen_id INT NOT NULL,
  usuario_id INT NOT NULL,
  nota DECIMAL(5,2) NOT NULL,
  tiempo_total INT NOT NULL, -- en segundos
  visible_para_usuario BOOLEAN DEFAULT true,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (examen_id) REFERENCES examenes(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS guias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  archivo VARCHAR(255), -- URL del PDF o documento
  examen_id INT,         -- opcional, puede estar asociada a un examen
  visible_para_usuario BOOLEAN DEFAULT true,
  FOREIGN KEY (examen_id) REFERENCES examenes(id)
);

INSERT INTO guias (titulo, descripcion, archivo)
VALUES ('Guía de bienvenida', 'Contiene la estructura inicial del trabajo', 'https://ejemplo.com/guia1.pdf');

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  duracion INT NOT NULL, -- en segundos
  examen_id INT, -- opcional
  FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  url VARCHAR(255) NOT NULL,
  duracion INT NOT NULL,
  examen_id INT,
  FOREIGN KEY (examen_id) REFERENCES examenes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS vistas_video (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id INT NOT NULL,
  usuario_id INT NOT NULL,
  tiempo_reproduccion INT NOT NULL, -- en segundos
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS foros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  autor_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  habilitado_respuestas BOOLEAN DEFAULT false,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS respuestas_foro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  foro_id INT NOT NULL,
  autor_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (foro_id) REFERENCES foros(id) ON DELETE CASCADE,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

ALTER TABLE usuarios ADD COLUMN activo BOOLEAN DEFAULT true;

ALTER TABLE videos ADD COLUMN visible_para_usuario BOOLEAN DEFAULT true;

ALTER TABLE foros ADD COLUMN imagen TEXT;

CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT false,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS guias_vistas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guia_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guia_id) REFERENCES guias(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

Select * from usuarios;

DELETE FROM preguntas WHERE examen_id >= 3;
INSERT INTO preguntas (examen_id, texto, opciones, respuesta_correcta, tiempo_maximo)
VALUES (
  3,
  '¿Cuál es la capital de Argentina?',
  '["Buenos Aires", "Córdoba", "Mendoza"]',
  'Buenos Aires',
  30
);
UPDATE preguntas
SET opciones = '["Buenos Aires", "Córdoba", "Mendoza"]'
WHERE id = 10;

SELECT opciones, JSON_VALID(opciones) AS valido FROM preguntas WHERE id = 10;











