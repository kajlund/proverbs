import { LitElement, html, css } from '../lit-core.min.js';
import { ProverbsAPI } from '../api.js';

export class HomeView extends LitElement {
  static properties = {
    proverbs: { type: Array },
    loading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }

    .proverb-card {
      background: var(--bg-card, #1a1d23);
      padding: 2.5rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.03);
      transition: transform 0.3s ease;
    }

    .proverb-card:hover {
      transform: translateY(-5px);
      border-color: var(--accent, #d4af37);
    }

    .quote {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      line-height: 1.4;
      font-style: italic;
      margin-bottom: 1.5rem;
      color: #fff;
    }

    .author {
      font-size: 0.9rem;
      color: var(--accent, #d4af37);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .tags {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    .tag {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      color: var(--text-muted, #94a3b8);
    }
  `;

  constructor() {
    super();
    this.proverbs = [];
    this.loading = true;
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      this.proverbs = await ProverbsAPI.getAll();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  formatTags(tagString) {
    if (!tagString || typeof tagString !== 'string') return [];
    return tagString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
  }

  render() {
    if (this.loading) return html`<p class="status">Loading wisdom...</p>`;

    return html`
      <div class="grid">
        ${this.proverbs.map(
          (p) => html`
            <div class="proverb-card">
              <div class="quote">"${p.content}"</div>
              <div class="author">${p.author || 'Unknown'}</div>
              <div class="tags">
                ${this.formatTags(p.tags).map(
                  (t) => html`<span class="tag">#${t}</span>`,
                )}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
customElements.define('home-view', HomeView);
