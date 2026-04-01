export const config = { runtime: 'edge' };

export default async function handler(request) {
  const apiKey = process.env.CLAUDE_API_KEY || '';

  try {
    const body = await request.text();

    const response = await fetch('https://pikachu.claudecode.love/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01',
      },
      body,
    });

    const data = await response.text();
    return new Response(data, {
      status: response.status,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
