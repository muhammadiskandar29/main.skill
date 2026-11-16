import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { store } from './data/store.js';

// PWA: Capture browser install prompt
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    store.pwaInstallPrompt = e;
    store.isPwaInstallable = true;
  });

  window.addEventListener('appinstalled', () => {
    store.pwaInstallPrompt = null;
    store.isPwaInstallable = false;
    console.log('[PWA] mine.skills successfully installed on device');
  });
}

createApp(App).mount('#app');
