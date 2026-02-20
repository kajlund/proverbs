import { LitElement, html, css } from '../lit-core.min.js';

export class ProverbCard extends LitElement {
  static properties = {
    proverb: { type: Object },
    copied: { type: Boolean },
  };

  constructor() {
    super();
    this.copied = false;
  }

  static styles = css`
    :host {
      display: block;
      break-inside: avoid; /* Prevents card from splitting across columns */
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card {
      position: relative;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1.5rem;
      border-radius: 16px;
      transition:
        transform 0.3s ease,
        border-color 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      border-color: var(--accent);
    }

    .content {
      font-family: 'Georgia', serif;
      font-size: 1.2rem;
      line-height: 1.6;
      color: var(--text-main);
      margin-bottom: 1rem;
      font-style: italic;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .author {
      color: var(--accent);
      font-weight: 600;
    }

    .category {
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      color: var(--text-muted);
    }

    .copy-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0; /* Hidden by default */
      transition: all 0.2s ease;
    }

    .card:hover .copy-btn {
      opacity: 1; /* Reveal on hover */
    }

    .copy-btn:hover {
      background: var(--accent);
      color: var(--bg-dark);
      border-color: var(--accent);
    }

    .copy-btn.success {
      background: #22c55e;
      color: white;
      border-color: #22c55e;
      opacity: 1;
    }
  `;

  async copyToClipboard() {
    const text = `"${this.proverb.content}" — ${this.proverb.author}`;
    try {
      await navigator.clipboard.writeText(text);
      this.copied = true;

      // Dispatch an event so the parent (HomeView) can show a toast!
      this.dispatchEvent(
        new CustomEvent('toast', {
          detail: { msg: 'Copied to clipboard!', type: 'success' },
          bubbles: true,
          composed: true,
        }),
      );

      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  render() {
    return html`
      <div class="card">
        <button
          class="copy-btn ${this.copied ? 'success' : ''}"
          @click=${this.copyToClipboard}
          title="Copy to clipboard"
        >
          ${this.copied ? html`✓` : html`📋`}
        </button>
        <div class="content">"${this.proverb.content}"</div>
        <div class="meta">
          <span class="author">— ${this.proverb.author}</span>
          <span class="category">${this.proverb.category}</span>
        </div>
      </div>
    `;
  }
}
customElements.define('proverb-card', ProverbCard);
