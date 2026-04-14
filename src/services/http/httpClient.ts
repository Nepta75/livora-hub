const API_URL = process.env.NEXT_PUBLIC_API_HOST;

interface FetchOptions extends RequestInit {
  token?: string;
  responseType?: 'json' | 'blob' | 'raw';
}

class HttpClient {
  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, responseType = 'json', ...fetchOptions } = options;

    const url = `${API_URL}/admin${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (fetchOptions.headers) {
      const existingHeaders = new Headers(fetchOptions.headers);
      existingHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...fetchOptions, credentials: 'include', headers });

    if (response.status === 401) {
      document.dispatchEvent(new Event('auth-error'));
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: string; message?: string };
      throw new Error(errorData.message ?? errorData.error ?? "Une erreur est survenue lors de l'appel API.");
    }

    if (response.status === 204) {
      return undefined as T;
    }

    if (responseType === 'blob') {
      return (await response.blob()) as T;
    }

    if (responseType === 'raw') {
      return response as unknown as T;
    }

    return (await response.json()) as T;
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  async patch<T>(endpoint: string, body: unknown, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  async delete<T = void>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();
