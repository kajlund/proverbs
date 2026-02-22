import { LitElement, html, css } from '../lit-core.min.js';
import { Router } from 'https://unpkg.com/@vaadin/router@1.7.5/dist/vaadin-router.js?module';
import { routes } from '../config/routes.js';

export class AppShell extends LitElement {
  static properties = {
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
    this.currentPath = '/';
  }

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    this.router = new Router(outlet);
    this.router.setRoutes(routes);

    this._boundLocationChanged = this._onLocationChanged.bind(this);
    window.addEventListener(
      'vaadin-router-location-changed',
      this._boundLocationChanged,
    );

    this.currentPath = window.location.pathname || '/';
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._boundLocationChanged,
    );
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
    return html`
      <nav>
        <a
          href="/"
          ?active=${this.currentPath === '/'}
          @click=${(e) => this._handleNavClick(e, '/')}
        >
          Home
        </a>
        <a
          href="/admin"
          ?active=${this.currentPath === '/admin'}
          @click=${(e) => this._handleNavClick(e, '/admin')}
        >
          Admin Dashboard
        </a>
      </nav>

      <div class="outlet-wrapper">
        <div id="outlet"></div>
      </div>
    `;
  }
}

customElements.define('app-shell', AppShell);
