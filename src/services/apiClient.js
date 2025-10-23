// Detect if we're running on Vercel or local development
const isVercel = window.location.hostname.includes('vercel.app') || 
                 window.location.hostname !== 'localhost';

const API_BASE = isVercel 
  ? '/api'  // Vercel serverless functions
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000'); // Local development

function getToken() {
  return localStorage.getItem('auth_token');
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || 'Erro de requisição');
  return data;
}
