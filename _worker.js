// Replace media URLs when served from fallback domain
const CANONICAL_MEDIA = 'https://media.jasem.dev';
const FALLBACK_MEDIA = 'https://pub-8c76f7ee203c4f509b9cb92dfa97165b.r2.dev';

export default {
  async fetch(request, env) {
    // ignore for custom/main domain
    if (!new URL(request.url).hostname.endsWith('.workers.dev')) {
      return env.ASSETS.fetch(request);
    }

    const response = await env.ASSETS.fetch(request);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    const html = (await response.text()).replaceAll(CANONICAL_MEDIA, FALLBACK_MEDIA);

    // Drop headers that no longer match body
    const headers = new Headers(response.headers);
    headers.delete('etag');
    headers.delete('content-length');

    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};