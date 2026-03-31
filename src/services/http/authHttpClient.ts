const API_URL = process.env.NEXT_PUBLIC_API_HOST;

async function authRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(errorData.error ?? 'Une erreur est survenue.');
  }

  return response.json() as Promise<T>;
}

export const authHttpClient = {
  post: <T>(endpoint: string, body: unknown) => authRequest<T>(endpoint, body),
};
