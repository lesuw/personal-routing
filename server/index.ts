import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import db from './db';
import { registerHandler, loginHandler, refreshHandler, logoutHandler, meHandler } from './handlers/auth';
import { getRoutesHandler, createRouteHandler } from './handlers/routes';
import { buildRouteHandler, healthHandler } from './handlers/routing';
import { authMiddleware } from './utils/auth';

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

// --- Routing ---
app.post('/api/build-route', buildRouteHandler);

// --- Health ---
app.get('/api/health', healthHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`RouteMind API on http://localhost:${PORT}`));
