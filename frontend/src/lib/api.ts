import axios from 'axios'
import { User, Idea, Analysis, Subscription, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebase_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('firebase_token')
      // Don't reload immediately - let auth state change handle it
      console.log('Auth error - token removed')
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (firebaseToken: string): Promise<User> => {
    const response = await api.post('/auth/login', { firebase_token: firebaseToken })
    return response.data
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export const ideasApi = {
  create: async (idea: Omit<Idea, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Idea> => {
    const response = await api.post('/ideas/', idea)
    return response.data
  },

  getAll: async (skip = 0, limit = 50): Promise<Idea[]> => {
    const response = await api.get(`/ideas?skip=${skip}&limit=${limit}`)
    return response.data
  },

  getById: async (id: number): Promise<Idea> => {
    const response = await api.get(`/ideas/${id}`)
    return response.data
  },

  update: async (id: number, idea: Partial<Idea>): Promise<Idea> => {
    const response = await api.put(`/ideas/${id}`, idea)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/ideas/${id}`)
  },
}

export const analysisApi = {
  start: async (ideaId: number): Promise<Analysis> => {
    const response = await api.post('/analysis/analyze', { idea_id: ideaId })
    return response.data
  },

  getById: async (id: number): Promise<Analysis> => {
    const response = await api.get(`/analysis/${id}`)
    return response.data
  },

  getByIdeaId: async (ideaId: number): Promise<Analysis> => {
    const response = await api.get(`/analysis/idea/${ideaId}`)
    return response.data
  },
}

export const subscriptionApi = {
  get: async (): Promise<Subscription> => {
    const response = await api.get('/subscriptions')
    return response.data
  },

  createCheckoutSession: async (planType: string): Promise<{ checkout_url: string }> => {
    const response = await api.post('/subscriptions/create-checkout-session', null, {
      params: { plan_type: planType }
    })
    return response.data
  },

  update: async (planType: string): Promise<Subscription> => {
    const response = await api.put('/subscriptions/upgrade', { plan_type: planType })
    return response.data
  },

  cancel: async (): Promise<void> => {
    await api.post('/subscriptions/cancel')
  },
}

export const chatApi = {
  sendMessage: async (messages: { role: string; content: string }[], ideaId?: number): Promise<{ message: string }> => {
    const response = await api.post('/chat/message', { messages, idea_id: ideaId })
    return response.data
  },

  getHistory: async (): Promise<any[]> => {
    const response = await api.get('/chat/history')
    return response.data
  }
}

export default api