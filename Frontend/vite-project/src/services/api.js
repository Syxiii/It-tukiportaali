const API_BASE_URL = 'http://localhost:5000/api';

// Auth Service
export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }
};

// Ticket Service
export const ticketService = {
  getAllTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    return response.json();
  },

  getTicketById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
    if (!response.ok) throw new Error('Tikettiä ei löytynyt');
    return response.json();
  },

  getMyTickets: async () => {
    const response = await fetch(`${API_BASE_URL}/my-tickets`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  createTicket: async (title, description, priority) => {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, description, priority })
    });
    if (!response.ok) throw new Error('Tiketin luominen epäonnistui');
    return response.json();
  },

  updateTicket: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Tiketin päivitys epäonnistui');
    return response.json();
  },

  deleteTicket: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Tiketin poistaminen epäonnistui');
    return response.json();
  }
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/dashboard`);
    if (!response.ok) throw new Error('Tilastojen haku epäonnistui');
    return response.json();
  }
};

export default {
  authService,
  ticketService,
  dashboardService
};
