// public/state/auth.js
class AuthStore {
  constructor() {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.user = null;
    this._checkPromise = null; // Our cache for the request
  }

  async checkStatus(force = false) {
    // If we already have a result and aren't forcing a refresh, return immediately
    if (this._checkPromise && !force) {
      return this._checkPromise;
    }

    // Create a new promise for the fetch operation
    this._checkPromise = (async () => {
      try {
        const res = await fetch('/auth', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Auth check failed');

        const data = await res.json();
        this.isLoggedIn = data !== null;
        this.isAdmin = data?.role === 'ADMIN';
        this.user = data;
        return {
          isLoggedIn: this.isLoggedIn,
          isAdmin: this.isAdmin,
          user: this.user,
        };
      } catch (err) {
        console.error(err);
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.user = null;
        return { isLoggedIn: false, isAdmin: false, user: null };
      }
    })();

    return this._checkPromise;
  }

  // Clear cache (useful for logout)
  clear() {
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.user = null;
    this._checkPromise = null;
  }
}

// Export a single instance to be shared across the whole app
export const authStore = new AuthStore();
