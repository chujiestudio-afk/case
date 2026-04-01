import https from 'https';

export default async function handler(req, res) {
  const apiKey = process.env.CLAUDE_API_KEY || '';
  const path = req.url.replace(/^\/api\/claude/, '') || '/';
  const body = JSON.stringify(req.body);

  const options = {
    hostname: 'pikachu.claudecode.love',
    path: path,
    method: req.method,
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body),
      'x-api-key': apiKey,
      'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
    },
  };

  return new Promise((resolve) => {
    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.on('data', (chunk) => { data += chunk; });
      proxyRes.on('end', () => {
        try {
          res.status(proxyRes.statusCode).json(JSON.parse(data));
        } catch (e) {
          res.status(proxyRes.statusCode).send(data);
        }
        resolve();
      });
    });

    proxyReq.on('error', (err) => {
      res.status(500).json({ error: err.message });
      resolve();
    });

    proxyReq.write(body);
    proxyReq.end();
  });
}
