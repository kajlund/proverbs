import { LitElement, html, css } from '../lit-core.min.js';

export class AdminControls extends LitElement {
  static properties = {
    searchQuery: { type: String },
    filterLang: { type: String },
  };

  static styles = css`
    .table-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .search-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }
    input {
      width: 100%;
      height: 42px;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      padding: 0 2.5rem 0 1rem; /* Extra padding on right for the button */
      border-radius: 8px;
      box-sizing: border-box;
    }
    .clear-btn {
      position: absolute;
      right: 10px;
      /* Remove default button styles */
      background: none;
      border: none;
      color: var(--accent);
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      padding: 5px;
      z-index: 2; /* Ensure it sits on top of the input */
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clear-btn:hover {
      color: white;
    }
    .filter-tabs {
      display: flex;
      gap: 0.4rem;
    }
    button {
      height: 36px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--text-muted);
      padding: 0 1rem;
      border-radius: 6px;
      cursor: pointer;
    }
    button[active] {
      background: var(--accent);
      color: var(--bg-dark);
    }
  `;

  render() {
    return html`
      <div class="table-controls">
        <div class="search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            .value=${this.searchQuery}
            @input=${(e) => this.dispatch('search', e.target.value)}
          />
          ${this.searchQuery
            ? html`
                <button
                  class="clear-btn"
                  @click=${() => this.dispatch('search', '')}
                >
                  &times;
                </button>
              `
            : ''}
        </div>

        <div class="filter-tabs">
          ${['all', 'eng', 'swe', 'fin'].map(
            (l) => html`
              <button
                ?active=${this.filterLang === l}
                @click=${() => this.dispatch('filter', l)}
              >
                ${l.toUpperCase()}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }

  dispatch(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }
}
customElements.define('admin-controls', AdminControls);
