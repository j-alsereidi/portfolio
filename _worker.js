// replace media urls for fallback domain

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // If not on workers.dev site, return
    if (!url.hostname.endsWith('.workers.dev')) {
      return env.ASSETS.fetch(request);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      const htmlText = await response.text();
      const modifiedHtml = htmlText.replaceAll(
        'https://media.jasem.dev',
        'https://pub-8c76f7ee203c4f509b9cb92dfa97165b.r2.dev'
      );

      return new Response(modifiedHtml, response);
    }

    return response;
  },
};