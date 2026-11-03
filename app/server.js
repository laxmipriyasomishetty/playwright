const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');

const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

const products = [
  { id: 1, name: 'Notebook', price: 4.5, stock: 120 },
  { id: 2, name: 'Desk Lamp', price: 22.0, stock: 15 },
  { id: 3, name: 'Backpack', price: 49.99, stock: 0 },
];

const feedback = [];

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve(null);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/products' && req.method === 'GET') {
    return sendJson(res, 200, products);
  }

  if (url.pathname.startsWith('/api/products/') && req.method === 'GET') {
    const id = Number(url.pathname.split('/').pop());
    const item = products.find((p) => p.id === id);
    return item ? sendJson(res, 200, item) : sendJson(res, 404, { error: 'Not found' });
  }

  if (url.pathname === '/api/feedback' && req.method === 'POST') {
    const body = await readBody(req);
    if (!body || !body.email || !body.message) {
      return sendJson(res, 400, { error: 'email and message are required' });
    }
    feedback.push(body);
    return sendJson(res, 201, { id: feedback.length, ...body });
  }

  if (url.pathname === '/api/slow') {
    return setTimeout(() => sendJson(res, 200, { message: 'Data loaded' }), 1500);
  }

  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  const full = path.normalize(path.join(PUBLIC, file));
  if (!full.startsWith(PUBLIC)) {
    res.writeHead(403);
    return res.end();
  }

  fs.readFile(full, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404</h1><p>Page not found</p>');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(full)] || 'text/plain' });
    res.end(content);
  });
});

server.listen(PORT, () => console.log(`Practice site running on http://localhost:${PORT}`));
