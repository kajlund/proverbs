import { LitElement, html, css } from '../lit-core.min.js';

export class ProverbTable extends LitElement {
  static properties = {
    // We use 'items' as a generic name so the table can handle any data array
    items: { type: Array },
    // 'proverbs' or 'simple'
    mode: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .table-grid {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }

    .grid-header {
      display: grid;
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem 1.5rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }

    .grid-row {
      display: grid;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: background 0.2s;
      align-items: center;
    }

    /* Template for Proverbs View */
    .mode-proverbs {
      grid-template-columns: 1fr 150px 120px 160px;
    }

    /* Template for Authors/Categories View */
    .mode-simple {
      grid-template-columns: 1fr 160px;
    }

    .grid-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .grid-row:last-child {
      border-bottom: none;
    }

    .cell-content .title {
      font-weight: 600;
      color: var(--accent);
      font-size: 0.8rem;
      margin-bottom: 0.2rem;
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
    }

    .btn-icon:hover {
      border-color: var(--accent);
      color: var(--text-main);
    }

    .btn-icon.delete:hover {
      border-color: #ef4444;
      color: #ef4444;
    }

    .tag {
      font-size: 0.7rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      color: var(--text-muted);
    }
  `;

  truncate(text, length = 70) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  // Helper to shout events back to AdminView
  dispatch(eventName, data) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: data,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.items || this.items.length === 0) {
      return html`<div
        class="table-grid"
        style="padding: 2rem; text-align: center; color: var(--text-muted);"
      >
        No data available.
      </div>`;
    }

    return html`
      <div class="table-grid">
        ${this.mode === 'proverbs'
          ? this.renderProverbsHeader()
          : this.renderSimpleHeader()}
        ${this.items.map((item) =>
          this.mode === 'proverbs'
            ? this.renderProverbRow(item)
            : this.renderSimpleRow(item),
        )}
      </div>
    `;
  }

  renderProverbsHeader() {
    return html`
      <div class="grid-header mode-proverbs">
        <div>Proverb</div>
        <div>Author</div>
        <div>Category</div>
        <div style="text-align: right;">Actions</div>
      </div>
    `;
  }

  renderSimpleHeader() {
    return html`
      <div class="grid-header mode-simple">
        <div>Name</div>
        <div style="text-align: right;">Actions</div>
      </div>
    `;
  }

  renderProverbRow(p) {
    return html`
      <div class="grid-row mode-proverbs">
        <div class="cell-content">
          <div class="title">${p.title}</div>
          <div>"${this.truncate(p.content)}"</div>
        </div>
        <div>${p.author}</div>
        <div><span class="tag">${p.category}</span></div>
        <div class="cell-actions">
          <button class="btn-icon" @click=${() => this.dispatch('edit', p)}>
            Edit
          </button>
          <button
            class="btn-icon delete"
            @click=${() => this.dispatch('delete', p.id)}
          >
            Delete
          </button>
        </div>
      </div>
    `;
  }

  renderSimpleRow(item) {
    return html`
      <div class="grid-row mode-simple">
        <div>${item.name}</div>
        <div class="cell-actions">
          <button
            class="btn-icon delete"
            @click=${() => this.dispatch('delete', item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('proverb-table', ProverbTable);
