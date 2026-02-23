import { LitElement, html, css } from '../lit-core.min.js';
import { ProverbsAPI } from '../api.js';

export class ErrorView extends LitElement {
  static properties = {
    path: { type: String },
    randomProverb: { type: Object },
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

    .proverb-suggestion {
      margin: 3rem 0;
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.02);
    }
    .proverb-suggestion p {
      margin-bottom: 1rem;
      color: var(--text-main);
    }
    blockquote {
      font-family: 'Georgia', serif;
      font-style: italic;
      font-size: 1.2rem;
      color: var(--text-main);
      margin: 0;
      padding: 0;
      border: 0;
    }
    blockquote footer {
      font-family: var(--font-ui);
      font-style: normal;
      font-size: 0.9rem;
      color: var(--text-muted);
      text-align: right;
      margin-top: 0.5rem;
    }
  `;

  constructor() {
    super();
    this.path = '';
    this.randomProverb = null;
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      this.randomProverb = await ProverbsAPI.getRandom();
    } catch (err) {
      console.error('Failed to fetch random proverb for error page:', err);
    }
  }

  render() {
    return html`
      <div class="error-code">404</div>
      <h1>Page not found</h1>
      <p>
        The path
        <code>${this.path || window?.location?.pathname || ''}</code> doesn't
        exist.
      </p>

      ${this.randomProverb
        ? html` <div class="proverb-suggestion">
            <p>While you're here, a bit of wisdom:</p>
            <blockquote>
              "${this.randomProverb.content}"
              <footer>— ${this.randomProverb.author}</footer>
            </blockquote>
          </div>`
        : ''}

      <a href="/">← Back to Home</a>
    `;
  }
}

customElements.define('error-view', ErrorView);
