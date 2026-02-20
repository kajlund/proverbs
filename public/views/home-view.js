import { LitElement, html, css } from '../lit-core.min.js';
import '../components/proverb-card.js';
import '../components/toast-container.js';
import { ProverbsAPI } from '../api.js';

export class HomeView extends LitElement {
  static properties = {
    proverbs: { type: Array },
    featuredProverb: { type: Object },
    loading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .hero {
      background: linear-gradient(135deg, var(--bg-card) 0%, #111 100%);
      border: 1px solid var(--accent);
      padding: 3rem;
      border-radius: 24px;
      margin-bottom: 4rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }

    .hero h2 {
      color: var(--accent);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 1.5rem;
    }

    .hero-content {
      font-family: 'Georgia', serif;
      font-size: 2rem;
      line-height: 1.4;
      color: var(--text-main);
      font-style: italic;
    }

    @media (max-width: 600px) {
      .hero-content {
        font-size: 1.5rem;
      }
      .hero {
        padding: 2rem;
      }
    }

    h1 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: var(--text-main);
    }

    /* The Masonry Magic */
    .masonry-grid {
      column-count: 3;
      column-gap: 1.5rem;
    }

    @media (max-width: 900px) {
      .masonry-grid {
        column-count: 2;
      }
    }

    @media (max-width: 600px) {
      .masonry-grid {
        column-count: 1;
      }
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
      this.featuredProverb = await ProverbsAPI.getRandom();
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

  handleToast(detail) {
    this.shadowRoot.getElementById('toaster').add(detail.msg, detail.type);
  }

  render() {
    return html`
      ${this.featuredProverb
        ? html`
            <div class="hero">
              <h2>Wisdom of the Moment</h2>
              <div class="hero-content">"${this.featuredProverb.content}"</div>
              <p style="color: var(--text-muted); margin-top: 1rem;">
                — ${this.featuredProverb.author}
              </p>
            </div>
          `
        : ''}

      <div class="masonry-grid" @toast=${(e) => this.handleToast(e.detail)}>
        ${this.proverbs?.map(
          (p) => html` <proverb-card .proverb=${p}></proverb-card> `,
        )}
      </div>

      <toast-container id="toaster"></toast-container>
    `;
  }
}
customElements.define('home-view', HomeView);
