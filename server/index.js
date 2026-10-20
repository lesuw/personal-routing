require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const db = require('./db.js');
const { registerHandler, loginHandler, refreshHandler, logoutHandler, meHandler } = require('./handlers/auth.js');
const { getRoutesHandler, createRouteHandler } = require('./handlers/routes.js');
const { buildRouteHandler, healthHandler } = require('./handlers/routing.js');
const { authMiddleware, JWT_SECRET } = require('./utils/auth.js');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- Auth endpoints ---
app.post('/api/register', registerHandler);
app.post('/api/login', loginHandler);
app.post('/api/refresh', refreshHandler);
app.post('/api/logout', logoutHandler);
app.get('/api/me', authMiddleware(db), meHandler);

// --- User routes ---
app.get('/api/routes', authMiddleware(db), getRoutesHandler);
app.post('/api/routes', authMiddleware(db), createRouteHandler);

// --- Routing (демо) ---
app.post('/api/build-route', buildRouteHandler);

// --- Health ---
app.get('/api/health', healthHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`RouteMind API on http://localhost:${PORT}`));