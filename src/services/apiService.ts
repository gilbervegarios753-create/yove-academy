/**
 * Centralized API Service Wrapper for YOVE Academy LMS
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export class ApiService {
  private static BASE_URL = '/api/v1';

  public static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('yove_auth_token') || ''}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error de conexión con el servidor YOVE API'
      };
    }
  }

  public static async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('yove_auth_token') || ''}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error de conexión al enviar datos'
      };
    }
  }
}
