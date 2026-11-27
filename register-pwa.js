if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(error => {
    console.warn('Could not register the Restaurant Accounts service worker.', error);
  });
}
