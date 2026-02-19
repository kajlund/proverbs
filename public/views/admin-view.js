import { LitElement, html, css } from '../lit-core.min.js';
import { ProverbsAPI } from '../api.js';
import '../components/quick-add.js';

export class AdminView extends LitElement {
  static properties = {
    proverbs: { type: Array },
    authors: { type: Array },
    categories: { type: Array },
    loading: { type: Boolean },
    currentProverb: { type: Object },
    editingId: { type: String },
    filterLang: { type: String },
    toastMsg: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding-top: 1rem;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
    }

    .btn-add {
      background: var(--accent);
      color: var(--bg-dark);
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-family: var(--font-ui);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .filter-tabs button {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 0.5rem 1.2rem;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .filter-tabs button:hover {
      border-color: rgba(255, 255, 255, 0.3);
      color: var(--text-main);
    }

    .filter-tabs button[active] {
      background: var(--accent);
      color: var(--bg-dark);
      border-color: var(--accent);
      font-weight: 600;
    }

    /* Container for the whole "table" */
    .table-grid {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }

    /* Header Row */
    .grid-header {
      display: grid;
      /* 4 columns: Content(grow), Author(150px), Category(120px), Actions(160px) */
      grid-template-columns: 1fr 150px 120px 160px;
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem 1.5rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    /* Individual Data Row */
    .grid-row {
      display: grid;
      grid-template-columns: 1fr 150px 120px 160px;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.2s;
      /* THE FIX: This ensures all items in the row align to the middle */
      align-items: center;
    }

    .grid-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .grid-row:last-child {
      border-bottom: none;
    }

    /* Cell specific styling */
    .cell-content {
      padding-right: 2rem;
      line-height: 1.5;
    }

    .cell-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      transition: all 0.2s;
      white-space: nowrap; /* Prevents buttons from stacking weirdly */
      display: inline-flex;
      align-items: center;
    }

    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-icon.delete:hover {
      color: #ef4444;
    }
    .btn-icon.edit:hover {
      color: var(--accent);
    }
    dialog {
      background: var(--bg-card);
      color: var(--text-main);
      border: 1px solid var(--accent);
      border-radius: 12px;
      padding: 2rem;
      width: 90%;
      max-width: 500px;
      font-size: 1rem;
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
    textarea {
      height: 100px;
      background: var(--bg-dark);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.8rem 2.5rem 0.8rem 1rem;
      font-size: 0.95rem;
    }
    input {
      background: var(--bg-dark);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.8rem 2.5rem 0.8rem 1rem;
      font-size: 0.95rem;
    }
    label {
      font-size: 0.8rem;
      color: var(--accent);
      text-transform: uppercase;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    select {
      appearance: none; /* Removes the default OS arrow */
      background-color: var(--bg-dark);
      background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
      color: var(--text-main);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.8rem 2.5rem 0.8rem 1rem;
      font-family: var(--font-ui);
      font-size: 0.95rem;
      cursor: pointer;
      transition:
        border-color 0.3s,
        box-shadow 0.3s;
      width: 100%;
    }

    select:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }

    select:hover {
      border-color: rgba(255, 255, 255, 0.3);
    }

    /* Style the dropdown menu itself (limited browser support for some parts, but colors work) */
    select option {
      background-color: var(--bg-card);
      color: var(--text-main);
      padding: 1rem;
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--accent);
      color: var(--bg-dark);
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease-out;
      z-index: 1000;
    }

    @keyframes slideIn {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  constructor() {
    super();
    this.proverbs = [];
    this.loading = true;
    this.filterLang = 'all';
  }

  async connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    try {
      const [p, a, c] = await Promise.all([
        ProverbsAPI.getAll(),
        ProverbsAPI.getAuthors(),
        ProverbsAPI.getCategories(),
      ]);
      this.proverbs = p;
      this.authors = a;
      this.categories = c;
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      this.loading = false;
    }
  }

  openAdd() {
    this.editingId = null;
    this.currentProverb = {
      title: '',
      content: '',
      authorId: '',
      categoryId: '',
      tags: '',
    };
    this.shadowRoot.getElementById('proverbModal').showModal();
  }

  openEdit(proverb) {
    this.editingId = proverb.id;
    this.currentProverb = { ...proverb };
    this.shadowRoot.getElementById('proverbModal').showModal();
  }

  async saveProverb(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let response;
      if (this.editingId) {
        response = await ProverbsAPI.updateProverb(this.editingId, data);
      } else {
        response = await ProverbsAPI.createProverb(data);
      }

      if (response.ok) {
        this.shadowRoot.getElementById('proverbModal').close();
        await this.loadData();
        this.showToast(
          this.editingId ? 'Proverb Updated!' : 'Proverb Created!',
        );
      } else {
        const errorData = await response.json();
        alert(`Save failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  formatTags(tagString) {
    if (!tagString || typeof tagString !== 'string') return [];
    return tagString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
  }

  truncate(text, length = 60) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  showToast(msg) {
    this.toastMsg = msg;
    setTimeout(() => {
      this.toastMsg = '';
    }, 3000);
  }

  async deleteItem(id) {
    if (confirm('Are you sure you want to delete this proverb?')) {
      const success = await ProverbsAPI.deleteProverb(id);
      if (success) {
        this.loadData(); // Re-fetch to update the UI
        // Optional: document.getElementById('globalToast').show('Deleted!', 'success');
      }
    }
  }

  render() {
    if (this.loading) return html`<p>Loading...</p>`;

    // Filter the proverbs list before mapping it
    const filteredProverbs =
      this.filterLang === 'all'
        ? this.proverbs
        : this.proverbs.filter((p) => p.lang === this.filterLang);

    return html`
      <div class="admin-header">
        <h1>Proverb Management</h1>
        <button class="btn-add" @click=${() => this.openAdd()}>
          New Proverb
        </button>
      </div>

      <div class="filter-tabs">
        <button
          ?active=${this.filterLang === 'all'}
          @click=${() => (this.filterLang = 'all')}
        >
          All
        </button>
        <button
          ?active=${this.filterLang === 'eng'}
          @click=${() => (this.filterLang = 'eng')}
        >
          English
        </button>
        <button
          ?active=${this.filterLang === 'swe'}
          @click=${() => (this.filterLang = 'swe')}
        >
          Swedish
        </button>
        <button
          ?active=${this.filterLang === 'fin'}
          @click=${() => (this.filterLang = 'fin')}
        >
          Finnish
        </button>
      </div>

      <div class="table-grid">
        <div class="grid-header">
          <div>Proverb</div>
          <div>Author</div>
          <div>Category</div>
          <div style="text-align: right;">Actions</div>
        </div>

        ${filteredProverbs.length === 0
          ? html`
              <div
                style="padding: 3rem; text-align: center; color: var(--text-muted);"
              >
                No proverbs found for this language.
              </div>
            `
          : filteredProverbs.map(
              (p) => html`
                <div class="grid-row">
                  <div class="cell-content">
                    <div
                      style="font-weight: 600; color: var(--accent); font-size: 0.8rem;"
                    >
                      ${p.title}
                    </div>
                    <div>"${this.truncate(p.content, 80)}"</div>
                  </div>
                  <div>${p.author}</div>
                  <div><span class="tag">${p.category}</span></div>
                  <div class="cell-actions">
                    <button
                      class="btn-icon edit"
                      @click=${() => this.openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      class="btn-icon delete"
                      @click=${() => this.deleteItem(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              `,
            )}
      </div>

      ${this.toastMsg
        ? html`<div class="toast" id="globalToast">${this.toastMsg}</div>`
        : ''}

      <dialog id="proverbModal">
        <form @submit=${this.saveProverb}>
          <h2>${this.editingId ? 'Edit Proverb' : 'New Proverb'}</h2>

          <label>Title</label>
          <input
            type="text"
            name="title"
            .value=${this.currentProverb?.title || ''}
            placeholder="e.g., On Persistence"
            required
          />
          <label>Language</label>
          <select name="lang" .value=${this.currentProverb?.lang || 'eng'}>
            <option value="eng">English</option>
            <option value="swe">Swedish</option>
            <option value="fin">Finnish</option>
          </select>

          <label>Quote</label>
          <textarea
            name="content"
            .value=${this.currentProverb?.content || ''}
            required
          ></textarea>

          <label>Author</label>
          <select
            name="authorId"
            .value=${this.currentProverb?.authorId || ''}
            required
          >
            <option value="">Select Author...</option>
            ${this.authors?.map(
              (a) => html`<option value="${a.id}">${a.name}</option>`,
            )}
          </select>
          <quick-add
            label="Author"
            endpoint="/authors"
            @success=${this.loadData}
          ></quick-add>

          <label>Category</label>
          <select
            name="categoryId"
            .value=${this.currentProverb?.categoryId || ''}
            required
          >
            <option value="">Select Category...</option>
            ${this.categories?.map(
              (c) => html`<option value="${c.id}">${c.name}</option>`,
            )}
          </select>
          <quick-add
            label="Category"
            endpoint="/categories"
            @success=${this.loadData}
          ></quick-add>

          <label>Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            .value=${this.currentProverb?.tags || ''}
          />

          <div class="modal-actions">
            <button
              type="button"
              @click=${() =>
                this.shadowRoot.getElementById('proverbModal').close()}
            >
              Cancel
            </button>
            <button type="submit" class="btn-add">Save</button>
          </div>
        </form>
      </dialog>
    `;
  }
}
customElements.define('admin-view', AdminView);
