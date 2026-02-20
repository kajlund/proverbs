import { LitElement, html, css } from '../lit-core.min.js';
import { themeStyles } from '../styles/theme.js';

export class ConfirmModal extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    title: { type: String },
    message: { type: String },
  };

  static styles = [
    themeStyles,
    css`
      dialog {
        background: var(--bg-card);
        color: white;
        border: 1px solid #444;
        border-radius: 12px;
        padding: 2rem;
        max-width: 400px;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      p {
        color: var(--text-muted);
        line-height: 1.5;
      }
    `,
  ];

  updated(changed) {
    if (changed.has('isOpen')) {
      const dialog = this.shadowRoot?.querySelector('dialog');
      if (dialog) {
        if (this.isOpen) {
          dialog.showModal();
        } else {
          dialog.close();
        }
      }
    }
  }

  firstUpdated() {
    // Ensure dialog is properly initialized
    const dialog = this.shadowRoot?.querySelector('dialog');
    if (dialog && this.isOpen) {
      dialog.showModal();
    }
  }

  render() {
    return html`
      <dialog @close=${() => this.dispatchEvent(new CustomEvent('cancel'))}>
        <h3 style="margin-top:0; color: var(--accent);">
          ${this.title || 'Confirm Action'}
        </h3>
        <p>${this.message || 'Are you sure you want to proceed?'}</p>
        <div class="actions">
          <button
            class="btn-ghost"
            @click=${() => {
              this.isOpen = false;
              this.dispatchEvent(new CustomEvent('cancel'));
            }}
          >
            Cancel
          </button>
          <button
            class="btn-primary"
            style="background: #ef4444; color: white;"
            @click=${() => {
              this.dispatchEvent(new CustomEvent('confirm'));
              this.isOpen = false;
            }}
          >
            Confirm
          </button>
        </div>
      </dialog>
    `;
  }
}
customElements.define('confirm-modal', ConfirmModal);
