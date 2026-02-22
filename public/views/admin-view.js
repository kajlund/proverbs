import { LitElement, html, css } from '../lit-core.min.js';
import { ProverbsAPI } from '../api.js';
import '../components/proverb-table.js';
import '../components/admin-controls.js';
import '../components/quick-add.js';
import '../components/proverb-modal.js';
import '../components/confirm-modal.js';
import '../components/toast-container.js';
import { themeStyles } from '../styles/theme.js';

export class AdminView extends LitElement {
  static properties = {
    proverbs: { type: Array },
    authors: { type: Array },
    categories: { type: Array },
    currentView: { type: String }, // 'proverbs', 'authors', or 'categories'
    loading: { type: Boolean },
    currentProverb: { type: Object },
    editingId: { type: String },
    filterLang: { type: String },
    searchQuery: { type: String },
    isModalOpen: { type: Boolean },
    confirmData: { type: Object },
  };

  static styles = [
    themeStyles, // Mix in shared styles
    css`
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

      .view-switcher {
        display: flex;
        background: var(--bg-card);
        padding: 0.3rem;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }

      .view-switcher button {
        background: transparent;
        border: none;
        color: var(--text-muted);
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .view-switcher button[active] {
        background: rgba(255, 255, 255, 0.05);
        color: var(--accent);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .table-controls {
        display: flex;
        justify-content: space-between;
        align-items: center; /* THE FIX: Vertically centers the search box and the tabs */
        gap: 1.5rem;
        margin-bottom: 2rem;
        background: rgba(255, 255, 255, 0.02);
        padding: 0.5rem;
        border-radius: 12px;
      }

      /* Ensure controls stack on mobile */
      @media (max-width: 768px) {
        .table-controls {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
        }
      }

      .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        color: var(--text-muted);
      }

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--accent);
        border-radius: 50%;
        animation: admin-spin 0.8s linear infinite;
      }

      @keyframes admin-spin {
        to { transform: rotate(360deg); }
      }
    `,
  ];

  constructor() {
    super();
    this.proverbs = [];
    this.loading = true;
    this.currentView = 'proverbs';
    this.filterLang = 'all';
    this.searchQuery = '';
    this.isModalOpen = false;
    this.toasts = [];
    this.confirmData = {
      open: false,
      title: '',
      message: '',
    };
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
      lang: 'eng',
      tags: '',
    };
    this.isModalOpen = true;
  }

  openEdit(proverb) {
    this.editingId = proverb.id;
    // Ensure we copy the object so we don't mutate the list directly
    this.currentProverb = { ...proverb };
    this.isModalOpen = true;
  }

  async saveProverb(data) {
    try {
      let response;

      if (this.editingId) {
        response = await ProverbsAPI.updateProverb(this.editingId, data);
      } else {
        response = await ProverbsAPI.createProverb(data);
      }

      if (response.ok) {
        this.isModalOpen = false; // Close the modal
        await this.loadData();
        this.showToast(
          this.editingId ? 'Proverb updated!' : 'Proverb created!',
          'success',
        );
      } else {
        const errorData = await response.json();
        alert(`Save failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  askConfirm(title, message, onConfirm) {
    this.confirmData = { open: true, title, message, onConfirm };
  }

  async deleteItem(id) {
    this.askConfirm(
      'Delete Proverb?',
      'This action cannot be undone.',
      async () => {
        const res = await ProverbsAPI.deleteProverb(id);
        if (res.ok) {
          this.loadData();
          this.showToast('Proverb deleted', 'success');
        } else {
          const err = await res.json();
          const msg = `Failed to delete proverb: ${err.message || ' Unknown error'}`;
          this.showToast(msg, 'error');
        }
      },
    );
  }

  async deleteAuthor(id) {
    this.askConfirm(
      'Delete Author?',
      'This action cannot be undone.',
      async () => {
        const res = await ProverbsAPI.deleteAuthor(id);
        if (res.ok) {
          await this.loadData();
          this.showToast('Author removed', 'success');
        } else {
          const err = await res.json();
          const msg = `Cannot delete: ${err.message || 'This author is still linked to proverbs.'}`;
          this.showToast(msg, 'error');
        }
      },
    );
  }

  async deleteCategory(id) {
    this.askConfirm(
      'Delete Category?',
      'This action cannot be undone.',
      async () => {
        const res = await ProverbsAPI.deleteCategory(id);
        if (res.ok) {
          await this.loadData();
          this.showToast('Category removed', 'success');
        } else {
          const err = await res.json();
          const msg = `Cannot delete: ${err.message || ' This categoryr is still linked to proverbs.'}`;
          this.showToast(msg, 'error');
        }
      },
    );
  }

  cancelEdit() {
    this.isModalOpen = false;
    this.currentProverb = null;
    this.editingId = null;
    this.showToast('Edit cancelled', 'info');
  }

  getFilteredProverbs() {
    const q = (this.searchQuery ?? '').toLowerCase().trim();
    return this.proverbs.filter((p) => {
      // 1. Language Filter
      const matchesLang =
        this.filterLang === 'all' || p.lang === this.filterLang;

      // 2. Search Filter (checks title, content, author, description, and category)
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.author?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);

      return matchesLang && matchesSearch;
    });
  }

  showToast(msg, type = 'info') {
    this.shadowRoot.getElementById('toaster').add(msg, type);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-state">
          <div class="loading-spinner"></div>
        </div>
      `;
    }

    return html`
      <div class="admin-header">
        <div class="view-switcher">
          <button
            ?active=${this.currentView === 'proverbs'}
            @click=${() => (this.currentView = 'proverbs')}
          >
            Proverbs
          </button>
          <button
            ?active=${this.currentView === 'authors'}
            @click=${() => (this.currentView = 'authors')}
          >
            Authors
          </button>
          <button
            ?active=${this.currentView === 'categories'}
            @click=${() => (this.currentView = 'categories')}
          >
            Categories
          </button>
        </div>

        ${this.currentView === 'proverbs'
          ? html`<button class="btn-primary" @click=${this.openAdd}>
              + New Proverb
            </button>`
          : ''}
      </div>

      <div class="main-content">${this.renderActiveContent()}</div>

      <proverb-modal
        .isOpen=${this.isModalOpen}
        .proverb=${this.currentProverb}
        .authors=${this.authors}
        .categories=${this.categories}
        @save=${(e) => this.saveProverb(e.detail)}
        @cancel=${() => this.cancelEdit()}
      ></proverb-modal>

      <toast-container id="toaster"></toast-container>

      <confirm-modal
        .isOpen=${this.confirmData.open}
        .title=${this.confirmData.title}
        .message=${this.confirmData.message}
        @cancel=${() =>
          (this.confirmData = { ...this.confirmData, open: false })}
        @confirm=${async () => {
          if (this.confirmData.onConfirm) {
            try {
              await this.confirmData.onConfirm();
            } catch (error) {
              console.error('Error in confirm callback:', error);
            }
          }
          this.confirmData = { ...this.confirmData, open: false };
        }}
      ></confirm-modal>
    `;
  }

  renderActiveContent() {
    switch (this.currentView) {
      case 'authors':
        return html`
          <div class="quick-add-section">
            <h3>Add New Author</h3>
            <quick-add
              label="Author"
              endpoint="/authors"
              @success=${this.loadData}
            ></quick-add>
          </div>
          <proverb-table
            mode="simple"
            .items=${this.authors}
            @delete=${(e) => this.deleteAuthor(e.detail)}
          >
          </proverb-table>
        `;

      case 'categories':
        return html`
          <div class="quick-add-section">
            <h3>Add New Category</h3>
            <quick-add
              label="Category"
              endpoint="/categories"
              @success=${this.loadData}
            ></quick-add>
          </div>
          <proverb-table
            mode="simple"
            .items=${this.categories}
            @delete=${(e) => this.deleteCategory(e.detail)}
          >
          </proverb-table>
        `;

      default: // This is the 'proverbs' view
        return html`
          <admin-controls
            .searchQuery=${this.searchQuery}
            .filterLang=${this.filterLang}
            @search=${(e) => (this.searchQuery = e.detail)}
            @filter=${(e) => (this.filterLang = e.detail)}
          >
          </admin-controls>

          <proverb-table
            mode="proverbs"
            .items=${this.getFilteredProverbs()}
            @edit=${(e) => this.openEdit(e.detail)}
            @delete=${(e) => this.deleteItem(e.detail)}
          ></proverb-table>
        `;
    }
  }
}

customElements.define('admin-view', AdminView);
