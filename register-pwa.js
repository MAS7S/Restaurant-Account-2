if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(error => {
    console.warn('Could not register the Restaurant Accounts service worker.', error);
  });
}

const install = document.querySelector('#install-app');
const installButton = install.querySelector('button');
const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let installPrompt;

function renderInstall() {
  const arabic = document.documentElement.lang === 'ar';
  const label = arabic ? 'تثبيت التطبيق' : 'Install app';
  install.dir = arabic ? 'rtl' : 'ltr';
  install.querySelector('summary span').textContent = label;
  installButton.textContent = label;
  installButton.hidden = !installPrompt;
  const help = install.querySelector('p');
  help.hidden = Boolean(installPrompt);
  help.textContent = isAppleMobile
    ? (arabic ? 'افتح الموقع في Safari، ثم اختر مشاركة ← إضافة إلى الشاشة الرئيسية.' : 'Open this site in Safari, then tap Share → Add to Home Screen.')
    : (arabic ? 'افتح الموقع في Chrome أو Edge، ثم اختر تثبيت التطبيق من قائمة المتصفح.' : 'Open this site in Chrome or Edge and choose Install app from the browser menu.');
}

new MutationObserver(renderInstall).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang']
});
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  renderInstall();
});
installButton.addEventListener('click', async () => {
  const prompt = installPrompt;
  if (!prompt) return;
  installPrompt = null;
  renderInstall();
  await prompt.prompt();
});
window.addEventListener('appinstalled', () => {
  installPrompt = null;
  install.hidden = true;
});
renderInstall();
install.hidden = Boolean(navigator.standalone);
