import { LitElement, html, css } from '../lit-core.min.js';

export class LoadingSpinner extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      /* Ensure the host itself doesn't hide the children */
      min-height: 50px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      /* Use a hardcoded fallback color if var() fails */
      border: 5px solid rgba(255, 255, 255, 0.1);
      border-left-color: #ffaa00; /* Direct gold color */
      border-left-color: var(--accent, #ffaa00);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      /* Ensure it's on top of the dark background */
      position: relative;
      z-index: 10001;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Full-page mode */
    :host([full-page]) {
      position: fixed;
      inset: 0;
      background: #111; /* Hardcoded dark background */
      background: var(--bg-dark, #111);
      z-index: 9999;
      flex-direction: column;
      gap: 1rem;
    }
  `;

  render() {
    return html`
      <div class="spinner"></div>
      <slot
        ><span style="color: white; font-family: sans-serif; font-size: 0.8rem;"
          >Loading...</span
        ></slot
      >
    `;
  }
}
customElements.define('loading-spinner', LoadingSpinner);
