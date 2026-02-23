export const CONFIG = {
  isDev: window.location.hostname === 'localhost',
  get loginUrl() {
    return this.isDev
      ? 'http://localhost:8080?openLogin=true'
      : 'https://kajlund.com/?openLogin=true';
  },
};
