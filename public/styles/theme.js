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

  .toast-container {
    position: fixed;
    top: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 9999;
  }

  .toast {
    background: var(--bg-card);
    border-left: 4px solid var(--accent);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
    min-width: 250px;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  label {
    display: block;
    font-size: 0.8rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  input {
    background: var(--bg-dark);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.8rem 2.5rem 0.8rem 1rem;
    font-size: 0.95rem;
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

  input:focus,
  textarea:focus,
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
`;
