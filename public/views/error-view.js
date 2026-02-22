import { LitElement, html, css } from '../lit-core.min.js';

export class ErrorView extends LitElement {
  static properties = {
    path: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }

    .error-code {
      font-size: 6rem;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.5rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.2s;
    }

    a:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    this.path = '';
  }

  render() {
    return html`
      <div class="error-code">404</div>
      <h1>Page not found</h1>
      <p>
        The path <code>${this.path || window?.location?.pathname || ''}</code>
        doesn't exist.
      </p>
      <a href="/">← Back to Home</a>
    `;
  }
}

customElements.define('error-view', ErrorView);
