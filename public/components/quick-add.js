import { LitElement, html, css } from '../lit-core.min.js';

export class QuickAdd extends LitElement {
  static properties = {
    label: { type: String },
    endpoint: { type: String },
  };

  static styles = css`
    div {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    input {
      background: var(--bg-dark);
      color: white;
      border: 1px solid #333;
      padding: 0.4rem;
      border-radius: 4px;
      flex: 1;
    }
    button {
      background: var(--accent);
      border: none;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }
  `;

  async submit() {
    const input = this.shadowRoot.querySelector('input');
    const name = input.value;
    if (!name) return;

    const res = await fetch(`/api/v1${this.endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    });

    if (res.ok) {
      input.value = '';
      this.dispatchEvent(
        new CustomEvent('success', { bubbles: true, composed: true }),
      );
    }
  }

  render() {
    return html`
      <div>
        <input type="text" placeholder="New ${this.label} name..." />
        <button type="button" @click=${this.submit}>Add</button>
      </div>
    `;
  }
}
customElements.define('quick-add', QuickAdd);
