import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { store } from './data/store.js';

// Device & OS Platform Detection
if (typeof window !== 'undefined') {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  store.device = {
    isIOS,
    isAndroid,
    isStandalone,
    isTouch
  };

  const docEl = document.documentElement;
  if (isIOS) docEl.classList.add('is-ios');
  if (isAndroid) docEl.classList.add('is-android');
  if (isStandalone) docEl.classList.add('is-standalone-pwa');
  if (isTouch) docEl.classList.add('is-touch-device');

  // Fix iOS Safari dynamic viewport height (100dvh fallback calculation)
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    docEl.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh, { passive: true });
  window.addEventListener('orientationchange', setVh, { passive: true });

  // PWA: Capture browser install prompt
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
