import type { Request, Response } from 'express';
import db from '../db';
import { fail } from '../utils/auth';
import type { PublicUser, RouteRow } from '../types';

interface RouteBody {
  title?: unknown;
  time?: unknown;
  km?: unknown;
  tag?: unknown;
  fav?: unknown;
}

function rowToRoute(row: RouteRow) {
  return { id: row.id, title: row.title, time: row.time, km: row.km, tag: row.tag, fav: !!row.fav };
}

function getRoutesHandler(req: Request, res: Response): Response {
  const user = req.user as PublicUser;
  const rows = db.prepare('SELECT * FROM routes WHERE user_id = ? ORDER BY id').all(user.id) as RouteRow[];
  return res.json(rows.map(rowToRoute));
}

function createRouteHandler(req: Request, res: Response): Response {
  const user = req.user as PublicUser;
  const { title = '', time = '', km = 0, tag = '', fav = false } = (req.body ?? {}) as RouteBody;
  const routeTitle = String(title).trim();
  if (!routeTitle) return fail(res, 400, 'Нужно название маршрута');

  const result = db.prepare(
    'INSERT INTO routes (user_id, title, time, km, tag, fav) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    user.id,
    routeTitle.slice(0, 120),
    String(time).slice(0, 40),
    Number(km) || 0,
    String(tag).slice(0, 40),
    fav ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM routes WHERE id = ?').get(result.lastInsertRowid) as RouteRow;
  return res.json(rowToRoute(row));
}

export {
  getRoutesHandler,
  createRouteHandler
};
