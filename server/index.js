const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DEMO_LINE = [
  [56.0097, 92.8525],
  [56.015, 92.86],
  [56.021, 92.875],
  [56.028, 92.89],
  [56.035, 92.905],
  [56.042, 92.92]
];

let routes = [
  { id: 1, title: 'Смотровые площадки Красноярска', time: '3 ч 20 мин', km: 8.5, tag: 'Природа', fav: true },
  { id: 2, title: 'Бобровый лог и лесные тропы', time: '2 ч 10 мин', km: 5.7, tag: 'Природа', fav: true },
  { id: 3, title: 'Город и набережная', time: '2 ч 50 мин', km: 7.4, tag: 'Комбинированный', fav: false }
];

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'routemind' }));

app.post('/api/login', (req, res) => {
  const { email } = req.body || {};
  res.json({ ok: true, user: { name: 'Гость', email: email || 'guest@routemind.ru' } });
});

app.post('/api/register', (req, res) => {
  const { name, email } = req.body || {};
  res.json({ ok: true, user: { name: name || 'Новый друг', email: email || 'new@routemind.ru' } });
});

app.get('/api/routes', (req, res) => res.json(routes));

app.post('/api/routes', (req, res) => {
  const r = { id: Date.now(), fav: false, ...req.body };
  routes.push(r);
  res.json(r);
});

app.post('/api/build-route', (req, res) => {
  // заглушка: без логики, всегда возвращает демо-линию
  res.json({
    time: '2 ч 40 мин',
    distance: '6.8 км',
    difficulty: 'Средняя сложность',
    line: DEMO_LINE
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`RouteMind API on http://localhost:${PORT}`));
