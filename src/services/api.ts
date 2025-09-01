// API service for communicating with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Shopping List API
  async getShoppingList(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/shopping');
  }

  async addShoppingItem(itemData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/shopping', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  async updateShoppingItem(id: string, updateData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/shopping/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteShoppingItem(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/shopping/${id}`, {
      method: 'DELETE',
    });
  }

  async searchProducts(query: string, filters?: any): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/shopping/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  async getSmartSuggestions(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/shopping/suggestions');
  }

  async clearAllItems(): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/shopping', {
      method: 'DELETE',
    });
  }

  // Voice Recognition API
  async processVoiceCommand(transcript: string, language: string, confidence?: number): Promise<ApiResponse<any>> {
    return this.request<any>('/voice/process', {
      method: 'POST',
      body: JSON.stringify({ transcript, language, confidence }),
    });
  }

  async getVoiceCommandHistory(limit?: number, offset?: number, language?: string): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    if (language) params.append('language', language);

    return this.request<any[]>(`/voice/history?${params.toString()}`);
  }

  async getVoiceRecognitionStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/voice/stats');
  }

  // Language API
  async getSupportedLanguages(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/languages');
  }

  async getLanguageConfig(code: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/languages/${code}`);
  }

  async getTranslations(code: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/languages/${code}/translations`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/health');
  }
}

// Create and export the API service instance
export const apiService = new ApiService(API_BASE_URL);

// Export individual methods for convenience
export const {
  getShoppingList,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  searchProducts,
  getSmartSuggestions,
  clearAllItems,
  processVoiceCommand,
  getVoiceCommandHistory,
  getVoiceRecognitionStats,
  getSupportedLanguages,
  getLanguageConfig,
  getTranslations,
  healthCheck
} = apiService;
