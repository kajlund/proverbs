import { LitElement, html, css } from '../lit-core.min.js';
import { ProverbsAPI } from '../api.js';
import '../components/proverb-table.js';
import '../components/admin-controls.js';
import '../components/quick-add.js';
import '../components/proverb-modal.js';
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
    toastMsg: { type: String },
    searchQuery: { type: String },
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

      /*
      // form {
      //   display: flex;
      //   flex-direction: column;
      //   gap: 1rem;
      // }

      // textarea {
      //   height: 100px;
      //   background: var(--bg-dark);
      //   color: white;
      //   border: 1px solid rgba(255, 255, 255, 0.1);
      //   border-radius: 8px;
      //   padding: 0.8rem 2.5rem 0.8rem 1rem;
      //   font-size: 0.95rem;
      // }

      // input {
      //   background: var(--bg-dark);
      //   color: white;
      //   border: 1px solid rgba(255, 255, 255, 0.1);
      //   border-radius: 8px;
      //   padding: 0.8rem 2.5rem 0.8rem 1rem;
      //   font-size: 0.95rem;
      // }

      // label {
      //   font-size: 0.8rem;
      //   color: var(--accent);
      //   text-transform: uppercase;
      // }
    */
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
    `,
  ];

  constructor() {
    super();
    this.proverbs = [];
    this.loading = true;
    this.currentView = 'proverbs';
    this.filterLang = 'all';
    this.searchQuery = '';
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

  async deleteAuthor(id) {
    if (!confirm('Are you sure? This will fail if the author has proverbs.'))
      return;

    try {
      const res = await ProverbsAPI.deleteAuthor(id);
      if (res.ok) {
        await this.loadData();
        this.showToast('Author removed');
      } else {
        const err = await res.json();
        // If the DB returns a foreign key constraint error
        alert(
          `Cannot delete: ${err.message || 'This author is still linked to proverbs.'}`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCategory(id) {
    if (!confirm('Delete this category?')) return;

    try {
      const res = await ProverbsAPI.deleteCategory(id);
      if (res.ok) {
        await this.loadData();
        this.showToast('Category removed');
      } else {
        alert('Cannot delete category while it has proverbs assigned to it.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getFilteredProverbs() {
    return this.proverbs.filter((p) => {
      // 1. Language Filter
      const matchesLang =
        this.filterLang === 'all' || p.lang === this.filterLang;

      // 2. Search Filter (checks title, content, and author name)
      const matchesSearch =
        p.title?.toLowerCase().includes(this.searchQuery) ||
        p.content?.toLowerCase().includes(this.searchQuery) ||
        p.author?.toLowerCase().includes(this.searchQuery);

      return matchesLang && matchesSearch;
    });
  }

  render() {
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
        @close=${() => (this.isModalOpen = false)}
      ></proverb-modal>

      ${this.toastMsg ? html`<div class="toast">${this.toastMsg}</div>` : ''}
    `;
  }

  renderActiveContent() {
    // IMPORTANT: Ensure this function always returns an 'html' template

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
