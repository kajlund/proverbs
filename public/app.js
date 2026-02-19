import { Router } from 'https://unpkg.com/@vaadin/router@1.7.5/dist/vaadin-router.js?module';

import './views/home-view.js';
import './views/admin-view.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([
  { path: '/', component: 'home-view' },
  { path: '/admin', component: 'admin-view' },
  { path: '(.*)', component: 'home-view' }, // Catch-all
]);

window.addEventListener('vaadin-router-location-changed', (event) => {
  const path = event.detail.location.pathname;
  document.querySelectorAll('nav a').forEach((link) => {
    link.toggleAttribute('active', link.getAttribute('href') === path);
  });
});
