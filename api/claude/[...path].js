export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  const apiKey = process.env.CLAUDE_API_KEY || '';

  // Strip /api/claude prefix → forward to proxy root
  const path = req.url.replace(/^\/api\/claude/, '') || '/';
  const targetUrl = `https://pikachu.claudecode.love${path}`;

  const fetchOptions = {
    method: req.method,
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
    },
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, fetchOptions);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
