const db = require('../db.js');
const { fail, authMiddleware } = require('../utils/auth.js');

function rowToRoute(row) {
  return { id: row.id, title: row.title, time: row.time, km: row.km, tag: row.tag, fav: !!row.fav };
}

function getRoutesHandler(req, res) {
  const rows = db.prepare('SELECT * FROM routes WHERE user_id = ? ORDER BY id').all(req.user.id);
  res.json(rows.map(rowToRoute));
}

function createRouteHandler(req, res) {
  const { title = '', time = '', km = 0, tag = '', fav = false } = req.body || {};
  const routeTitle = String(title).trim();
  if (!routeTitle) return fail(res, 400, 'Нужно название маршрута');

  const result = db.prepare(
    'INSERT INTO routes (user_id, title, time, km, tag, fav) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    req.user.id,
    routeTitle.slice(0, 120),
    String(time).slice(0, 40),
    Number(km) || 0,
    String(tag).slice(0, 40),
    fav ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM routes WHERE id = ?').get(result.lastInsertRowid);
  res.json(rowToRoute(row));
}

module.exports = {
  getRoutesHandler,
  createRouteHandler
};