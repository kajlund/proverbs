import { LitElement, html, css } from '../lit-core.min.js';

export class ToastItem extends LitElement {
  static properties = {
    msg: { type: String },
    type: { type: String, reflect: true }, // 'success', 'error', 'info'
    duration: { type: Number },
  };

  constructor() {
    super();
    this.duration = 4000;
    this.timer = null;
    this.remaining = this.duration;
    this.start = null;
  }

  static styles = css`
    :host {
      display: block;
      background: var(--bg-card);
      color: white;
      padding: 1rem;
      border-radius: 4px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      min-width: 280px;
      position: relative;
      border-left: 4px solid var(--accent);
      pointer-events: none;
      animation: slideIn 0.3s ease-out;
      pointer-events: auto;
    }
    /* Type-specific border colors */
    :host([type='success']) {
      border-left-color: #22c55e;
    }
    :host([type='error']) {
      border-left-color: #ef4444;
    }
    :host([type='info']) {
      border-left-color: var(--accent);
    }

    .content {
      margin-right: 1.5rem;
    }
    .close-btn {
      position: absolute;
      right: 8px;
      top: 8px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.4rem;
      font-weight: 600;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

  firstUpdated() {
    this.resumeTimer();
  }

  resumeTimer() {
    this.start = Date.now();
    this.timer = setTimeout(() => this.close(), this.remaining);
  }

  pauseTimer() {
    clearTimeout(this.timer);
    this.remaining -= Date.now() - this.start;
  }

  close() {
    this.dispatchEvent(
      new CustomEvent('remove', { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div @mouseenter=${this.pauseTimer} @mouseleave=${this.resumeTimer}>
        <div class="content">${this.msg}</div>
        <button class="close-btn" @click=${this.close}>&times;</button>
      </div>
    `;
  }
}
customElements.define('toast-item', ToastItem);
