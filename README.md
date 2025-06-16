# Plataforma de capacitación

Este repositorio contiene una aplicación web dividida en **backend** y **frontend**.

## Backend

- Node.js con Express.
- Usa MySQL como base de datos (ver `Db.sql` para la estructura inicial).
- Las variables de entorno se definen en `backend/.env`.
- Se inicia con:

```bash
cd backend
npm install
node app.js
```

Incluye múltiples rutas bajo `/api`. Se añadió una ruta de chequeo de estado:

```
GET /api/health
```

Retorna un JSON con el estado del servidor.

## Frontend

- Proyecto Angular ubicado en `frontend/plataforma-capacitacion`.
- Para iniciar en modo desarrollo:

```bash
cd frontend/plataforma-capacitacion
npm install
npm start
```

Luego abre `http://localhost:4200/` en el navegador.
