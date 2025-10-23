// Detect environment and set correct API base URL  
const getApiBase = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  
  // Se VITE_API_URL estiver definido, use ele (prioridade máxima)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const hostname = window.location.hostname;
  
  // Force use AlwaysData API
  if (import.meta.env.VITE_USE_ALWAYSDATA_API === 'true') {
    return 'https://emanuelprado.alwaysdata.net';
  }
  
  // AlwaysData production
  if (hostname === 'emanuelprado.alwaysdata.net') {
    return 'https://emanuelprado.alwaysdata.net';
  }
  
  // Vercel deployment
  if (hostname.includes('vercel.app')) {
    return '/api';
  }
  
  // For local testing, default to AlwaysData (since that's where your server is)
  if (hostname === 'localhost') {
    return import.meta.env.VITE_USE_LOCAL_API === 'true' 
      ? (import.meta.env.VITE_API_URL || 'http://localhost:3000')
      : 'https://emanuelprado.alwaysdata.net';
  }
  
  // Default fallback to AlwaysData
  return 'https://emanuelprado.alwaysdata.net';
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
