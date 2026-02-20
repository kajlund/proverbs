import { LitElement, html, css } from '../lit-core.min.js';
import './toast-item.js';

export class ToastContainer extends LitElement {
  static properties = {
    toasts: { type: Array },
  };

  constructor() {
    super();
    this.toasts = [];
  }

  static styles = css`
    :host {
      position: fixed;
      top: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 10000;
    }
  `;

  // Public method to be called by AdminView
  add(msg, type = 'info') {
    const id = crypto.randomUUID();
    this.toasts = [{ id, msg, type }, ...this.toasts];
  }

  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  render() {
    return this.toasts.map(
      (t) => html`
        <toast-item
          .msg=${t.msg}
          type=${t.type}
          @remove=${() => this.remove(t.id)}
        >
        </toast-item>
      `,
    );
  }
}
customElements.define('toast-container', ToastContainer);
