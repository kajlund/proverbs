import { LitElement, html, css } from '../lit-core.min.js';
import { Router } from 'https://unpkg.com/@vaadin/router@1.7.5/dist/vaadin-router.js?module';
import { routes } from '../routes.js';
import { authStore } from '../stores/auth-store.js';
import { CONFIG } from '../config.js';
import './loading-spinner.js';
import './toast-container.js';

export class AppShell extends LitElement {
  static properties = {
    isInitializing: { type: Boolean },
    currentPath: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 100vh;
    }

    nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding: 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: color 0.3s;
      cursor: pointer;
    }

    nav a:hover,
    nav a[active] {
      color: var(--accent);
    }
    .nav-avatar {
      display: block;
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 50%;
      object-fit: cover; /* Prevents stretching if the image isn't square */
      border: 2px solid var(--accent);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .outlet-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    #outlet {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }
  `;

  constructor() {
    super();
    this.isInitializing = true;
    this.currentPath = '/';
  }

  async connectedCallback() {
    super.connectedCallback();

    window.addEventListener('show-toast', (e) => this._handleGlobalToast(e));

    // Create a 800ms timer
    const minTimer = new Promise((resolve) => setTimeout(resolve, 400));

    // Wait for BOTH the auth check and the timer to finish
    await Promise.all([authStore.checkStatus(), minTimer]);

    this.isInitializing = false;

    await this.updateComplete;

    this.initRouter();
    // re-render to reflect auth status in the UI
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('show-toast', this._handleGlobalToast);
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._boundLocationChanged,
    );
  }

  _handleGlobalToast(e) {
    const toaster = this.shadowRoot.querySelector('toast-container');
    if (toaster) {
      toaster.add(e.detail.msg, e.detail.type);
    }
  }

  initRouter() {
    const outlet = this.shadowRoot.querySelector('#outlet');
    this.router = new Router(outlet);
    this.router.setRoutes(routes);
  }

  firstUpdated() {
    // const outlet = this.shadowRoot.getElementById('outlet');
    // this.router = new Router(outlet);
    // this.router.setRoutes(routes);

    this._boundLocationChanged = this._onLocationChanged.bind(this);
    window.addEventListener(
      'vaadin-router-location-changed',
      this._boundLocationChanged,
    );

    this.currentPath = window.location.pathname || '/';
  }

  _onLocationChanged(event) {
    this.currentPath = event.detail?.location?.pathname || '/';
  }

  _handleNavClick(e, path) {
    e.preventDefault();
    if (this.currentPath === path) return;
    Router.go(path);
  }

  render() {
    const { user } = authStore;

    if (this.isInitializing) {
      return html`<loading-spinner full-page></loading-spinner>`;
    }

    return html`
      <toast-container id="toaster"></toast-container>

      <nav>
        <a
          href="/"
          ?active=${this.currentPath === '/'}
          @click=${(e) => this._handleNavClick(e, '/')}
          >Home</a
        >
        ${user
          ? html`
              <a
                href="/admin"
                ?active=${this.currentPath === '/admin'}
                @click=${(e) => this._handleNavClick(e, '/admin')}
              >
                Admin Dashboard
              </a>
              <img
                src="${user.avatar}"
                alt="${user.alias}"
                class="nav-avatar"
              />
            `
          : html`
              <a href="${CONFIG.loginUrl}" class="login-link">
                Login <span>&rarr;</span>
              </a>
            `}
      </nav>

      <div class="outlet-wrapper">
        <div id="outlet"></div>
      </div>
    `;
  }
}

customElements.define('app-shell', AppShell);
