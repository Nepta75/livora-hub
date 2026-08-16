const API_URL = process.env.NEXT_PUBLIC_API_HOST;

interface FetchOptions extends RequestInit {
  token?: string;
  responseType?: 'json' | 'blob' | 'raw';
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/**
 * Typed backend codes the hub can act on, mapped to French copy. The API emits
 * these in `fields[]` for refusals a screen should explain rather than swallow.
 */
const CODE_TO_FR: Record<string, string> = {
  invalid_date_format: 'Date invalide. Format attendu : AAAA-MM-JJ.',
  from_after_to: 'La date de début doit précéder la date de fin.',
};

const GENERIC_MESSAGE = "Une erreur est survenue lors de l'appel API.";

/**
 * `InvalidJsonException` builds its message as "<Class> invalid json", which is
 * an internal PHP class name in English. That suffix is a constant no caller
 * overrides, so it is the message of EVERY 400 this API raises, and this client
 * shows `message` verbatim in toasts. What carries the meaning is `fields[]`.
 *
 * Resolution order, the same one `vista-app`'s `getApiErrorMessage` uses:
 *  1. a known typed code → its French copy;
 *  2. the raw first field value — a Symfony validator constraint phrase, or a
 *     code another module maps itself (`mapPromoCodeError` matches on the
 *     message), and always better than a generic sentence;
 *  3. the top-level message, unless it is the wrapper;
 *  4. the generic fallback.
 *
 * `fields[]` is not always a list of objects: three services send a flat list of
 * strings, so both shapes are read.
 */
const WRAPPER_MESSAGE = /invalid json$/i;

function fieldValues(fields: unknown): string[] {
  if (!Array.isArray(fields)) return [];

  return fields.flatMap((entry) => {
    if (typeof entry === 'string') return [entry];
    if (entry && typeof entry === 'object') {
      return Object.values(entry).filter((value): value is string => typeof value === 'string');
    }
    return [];
  });
}

function readableMessage(body: { error?: string; message?: string; fields?: unknown }): string {
  const values = fieldValues(body.fields);

  for (const value of values) {
    if (CODE_TO_FR[value]) return CODE_TO_FR[value];
  }

  if (values[0]) return values[0];

  const raw = body.message ?? body.error;
  if (!raw || WRAPPER_MESSAGE.test(raw)) return GENERIC_MESSAGE;

  return raw;
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
      const errorData = (await response.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        fields?: unknown;
      };
      throw new HttpError(readableMessage(errorData), response.status, errorData);
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
