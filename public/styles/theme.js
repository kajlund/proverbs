import { css } from '../lit-core.min.js';

export const themeStyles = css`
  .btn-primary {
    background: var(--accent);
    color: var(--bg-dark);
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-ui);
    transition:
      transform 0.1s,
      filter 0.2s;
  }

  .btn-primary:hover {
    filter: brightness(1.1);
  }

  .btn-primary:active {
    transform: scale(0.98);
  }

  /* The "Cancel" or "Ghost" button */
  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-ghost:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .btn-icon {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    transition: all 0.2s;
  }

  .btn-icon:hover {
    border-color: var(--accent);
    color: var(--text-main);
  }

  .tag {
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
  }

  /* Shared Form Labels */
  label {
    display: block;
    font-size: 0.75rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }
`;
