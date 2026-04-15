const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service API pour communiquer avec le backend
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Configuration des headers avec token
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Gestion des erreurs
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur serveur');
    }
    
    return data;
  }

  // Inscription
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    const data = await this.handleResponse(response);
    
    // Sauvegarder le token
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
    }
    
    return data;
  }

  // Connexion
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const data = await this.handleResponse(response);
    
    // Sauvegarder le token
    if (data.token) {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      
      // Sauvegarder dans les comptes récents si "remember me"
      if (credentials.remember) {
        this.saveRecentAccount(data.user);
      }
    }
    
    return data;
  }

  // Déconnexion
  async logout() {
    try {
      if (this.token) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: this.getHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('token');
    }
  }

  // Obtenir le profil utilisateur
  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getHeaders(),
    });
    
    return await this.handleResponse(response);
  }

  // Mettre à jour le profil
  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    
    const data = await this.handleResponse(response);
    
    // Mettre à jour le profil dans les comptes récents
    if (data.user) {
      this.updateRecentAccount(data.user);
    }
    
    return data;
  }

  // Supprimer le compte
  async deleteAccount() {
    const response = await fetch(`${this.baseURL}/auth/delete`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    const data = await this.handleResponse(response);
    
    // Nettoyer les données locales
    this.token = null;
    localStorage.removeItem('token');
    this.removeRecentAccount();
    
    return data;
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.token;
  }

  // Sauvegarder un compte récent
  saveRecentAccount(user) {
    const recentAccounts = JSON.parse(localStorage.getItem('recent_accounts') || '[]');
    const existingIndex = recentAccounts.findIndex(acc => acc.email === user.email);
    
    const accountData = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      recentAccounts[existingIndex] = accountData;
    } else {
      recentAccounts.push(accountData);
    }
    
    // Limiter à 5 comptes récents
    if (recentAccounts.length > 5) {
      recentAccounts.shift();
    }
    
    localStorage.setItem('recent_accounts', JSON.stringify(recentAccounts));
  }

  // Mettre à jour un compte récent
  updateRecentAccount(user) {
    const recentAccounts = JSON.parse(localStorage.getItem('recent_accounts') || '[]');
    const existingIndex = recentAccounts.findIndex(acc => acc.email === user.email);
    
    if (existingIndex >= 0) {
      recentAccounts[existingIndex] = {
        ...recentAccounts[existingIndex],
        ...user,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('recent_accounts', JSON.stringify(recentAccounts));
    }
  }

  // Supprimer un compte récent
  removeRecentAccount(email) {
    const recentAccounts = JSON.parse(localStorage.getItem('recent_accounts') || '[]');
    const filteredAccounts = recentAccounts.filter(acc => acc.email !== email);
    localStorage.setItem('recent_accounts', JSON.stringify(filteredAccounts));
  }

  // Obtenir les comptes récents
  getRecentAccounts() {
    return JSON.parse(localStorage.getItem('recent_accounts') || '[]');
  }

  // Définir le token manuellement
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Vérifier la validité du token
  async verifyToken() {
    if (!this.token) return false;
    
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      // Token invalide, le supprimer
      this.setToken(null);
      return false;
    }
  }
}

export default new ApiService();
