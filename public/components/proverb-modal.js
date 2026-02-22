import { LitElement, html, css } from '../lit-core.min.js';
import { themeStyles } from '../styles/theme.js';

export class ProverbModal extends LitElement {
  static properties = {
    proverb: { type: Object },
    authors: { type: Array },
    categories: { type: Array },
    isOpen: { type: Boolean },
  };

  static styles = [
    themeStyles,
    css`
      dialog {
        background: var(--bg-card);
        color: white;
        border: 1px solid var(--accent);
        border-radius: 12px;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      label {
        font-size: 0.75rem;
        color: var(--accent);
        text-transform: uppercase;
        margin: 0;
      }
      input,
      textarea {
        background: var(--bg-dark);
        color: white;
        border: 1px solid #333;
        padding: 0.6rem;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
      }
    `,
  ];

  // Manual trigger to open/close via the native API
  updated(changedProperties) {
    if (changedProperties.has('isOpen')) {
      const dialog = this.shadowRoot.querySelector('dialog');
      if (this.isOpen) {
        dialog.showModal();
        // Add mode: explicitly clear form to avoid stale values from prior edits
        if (!this.proverb?.id) {
          requestAnimationFrame(() => this._clearFormForAdd());
        }
      } else {
        dialog.close();
      }
    }
  }

  _clearFormForAdd() {
    const form = this.shadowRoot?.querySelector('form');
    if (!form) return;
    const defaults = {
      title: '',
      content: '',
      description: '',
      authorId: '',
      categoryId: '',
      lang: 'eng',
      tags: '',
    };
    for (const [name, value] of Object.entries(defaults)) {
      const el = form.elements[name];
      if (el) el.value = value;
    }
  }

  handleSave(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // We dispatch the 'save' event.
    // 'detail' is the standard way to pass data in CustomEvents.
    this.dispatchEvent(
      new CustomEvent('save', {
        detail: data,
        bubbles: true,
        composed: true, // Allows the event to cross the Shadow DOM boundary
      }),
    );
  }

  handleCancel(e) {
    e.preventDefault();
    this.isOpen = false;
    // Explicitly signal that the user cancelled editing
    this.dispatchEvent(
      new CustomEvent('cancel', { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <dialog>
        <form @submit=${this.handleSave}>
          <h2>${this.proverb?.id ? 'Edit Proverb' : 'New Proverb'}</h2>

          <div class="form-group">
            <label>Title</label>
            <input name="title" .value=${this.proverb?.title || ''} required />
          </div>

          <div class="form-group">
            <label>Content</label>
            <textarea
              name="content"
              .value=${this.proverb?.content || ''}
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Description</label>
            <input
              name="description"
              .value=${this.proverb?.description || ''}
            />
          </div>

          <div class="form-group">
            <label>Author</label>
            <select
              name="authorId"
              .value=${this.proverb?.authorId ?? ''}
              required
            >
              <option value="" disabled>Select author...</option>
              ${this.authors?.map(
                (a) =>
                  html`<option
                    value="${a.id}"
                    ?selected=${this.proverb?.authorId === a.id}
                  >
                    ${a.name}
                  </option>`,
              )}
            </select>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select
              name="categoryId"
              .value=${this.proverb?.categoryId ?? ''}
              required
            >
              <option value="" disabled>Select category...</option>
              ${this.categories?.map(
                (c) =>
                  html`<option
                    value="${c.id}"
                    ?selected=${this.proverb?.categoryId === c.id}
                  >
                    ${c.name}
                  </option>`,
              )}
            </select>
          </div>

          <div class="form-group">
            <label>Language</label>
            <select name="lang" .value=${this.proverb?.lang || 'eng'} required>
              <option value="eng" ?selected=${this.proverb?.lang === 'eng'}>
                English
              </option>
              <option value="swe" ?selected=${this.proverb?.lang === 'swe'}>
                Swedish
              </option>
              <option value="fin" ?selected=${this.proverb?.lang === 'fin'}>
                Finnish
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" name="tags" .value=${this.proverb?.tags || ''} />
          </div>

          <div class="actions">
            <button type="button" class="btn-ghost" @click=${this.handleCancel}>
              Cancel
            </button>
            <button class="btn-primary" type="submit">Save</button>
          </div>
        </form>
      </dialog>
    `;
  }
}
customElements.define('proverb-modal', ProverbModal);
