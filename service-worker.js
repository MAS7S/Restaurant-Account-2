// Keep Firebase authentication and ledger requests on the network.
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.mode !== 'navigate' || request.url !== self.registration.scope) return;

  event.respondWith(fetch(request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Restaurant Accounts</title><h1>Restaurant Accounts</h1><p>Reconnect to the internet and reload to open your accounts.</p><p lang="ar" dir="rtl">اتصل بالإنترنت وأعد تحميل الصفحة لفتح حسابات المطعم.</p></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )));
});
