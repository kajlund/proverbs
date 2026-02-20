const BASE_URL = '/api/v1';

// const getAuthHeader = () => {
//   const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
//   return match ? `Bearer ${match[2]}` : '';
// };

// Helper to avoid repeating the credentials flag
const fetchOptions = (method, data) => ({
  method,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: getAuthHeader(),
  },
  body: JSON.stringify(data),
  credentials: 'include', // THIS IS KEY: sends the cookie to the API
});

export const ProverbsAPI = {
  async getAuthors() {
    const res = await fetch(`${BASE_URL}/authors`);
    if (!res.ok) throw new Error('Failed to fetch authors');
    const response = await res.json();
    return response.data;
  },

  async getCategories() {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const response = await res.json();
    return response.data;
  },

  // Public fetch
  async getAll() {
    const res = await fetch(`${BASE_URL}/proverbs`);
    if (!res.ok) throw new Error('Failed to fetch proverbs');
    const response = await res.json();
    return response.data;
  },

  async getRandom() {
    const res = await fetch(`${BASE_URL}/proverbs/random`);
    if (!res.ok) throw new Error('Failed to fetch random proverb');
    const response = await res.json();
    return response.data;
  },

  async createProverb(data) {
    return fetch(`${BASE_URL}/proverbs`, fetchOptions('POST', data));
  },

  async updateProverb(id, data) {
    return fetch(`${BASE_URL}/proverbs/${id}`, fetchOptions('PUT', data));
  },

  async deleteProverb(id) {
    return fetch(`${BASE_URL}/proverbs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },
  async deleteAuthor(id) {
    return fetch(`${BASE_URL}/authors/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },

  async deleteCategory(id) {
    return fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },
};
