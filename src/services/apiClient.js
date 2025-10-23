// Detect environment and set correct API base URL
const getApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  
  const hostname = window.location.hostname;
  
  // AlwaysData production
  if (hostname === 'emanuelprado.alwaysdata.net') {
    return 'https://emanuelprado.alwaysdata.net';
  }
  
  // Vercel deployment
  if (hostname.includes('vercel.app')) {
    return '/api';
  }
  
  // Local development
  if (hostname === 'localhost') {
    return import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }
  
  // Default fallback
  return 'http://localhost:3000';
};

const API_BASE = getApiBase();

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
