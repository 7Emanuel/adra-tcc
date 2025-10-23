// Detect environment and set correct API base URL
const getApiBase = () => {
  if (typeof window === 'undefined') return '/api/admin';
  
  const hostname = window.location.hostname;
  
  // Force use AlwaysData API (can be set in .env)
  if (import.meta.env.VITE_USE_ALWAYSDATA_API === 'true') {
    return 'https://emanuelprado.alwaysdata.net/api/admin';
  }
  
  // AlwaysData production
  if (hostname === 'emanuelprado.alwaysdata.net') {
    return 'https://emanuelprado.alwaysdata.net/api/admin';
  }
  
  // Vercel deployment
  if (hostname.includes('vercel.app')) {
    return '/api/admin';
  }
  
  // For local testing, default to AlwaysData API (since that's where your server is)
  // Only use localhost:3000 if explicitly set
  if (hostname === 'localhost') {
    return import.meta.env.VITE_USE_LOCAL_API === 'true' 
      ? 'http://localhost:3000/api/admin' 
      : 'https://emanuelprado.alwaysdata.net/api/admin';
  }
  
  // Default fallback to AlwaysData
  return 'https://emanuelprado.alwaysdata.net/api/admin';
};

const API = getApiBase();

async function json(res) {
  const text = await res.text();
  console.log('Response URL:', res.url);
  console.log('Response status:', res.status);
  console.log('Response text:', text.substring(0, 200));
  
  if (!res.ok) {
    let err = {};
    try {
      err = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse error response as JSON:', e);
      throw new Error(`Erro ${res.status}: ${text.substring(0, 100)}`);
    }
    throw new Error(err.error || `Erro ${res.status}`);
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse success response as JSON:', e);
    throw new Error('Resposta inválida do servidor');
  }
}

export const adminApi = {
  login(password) {
    const loginUrl = API.includes('vercel.app') || API.includes('/api/admin') ? `${API}/login` : `${API}/login`;
    console.log('API Base:', API);
    console.log('Login URL:', loginUrl);
    console.log('Current hostname:', window.location.hostname);
    return fetch(loginUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), credentials: 'include' }).then(json);
  },
  logout() {
    const logoutUrl = API.includes('vercel.app') || API.includes('/api/admin') ? `${API}/logout` : `${API}/logout`;
    return fetch(logoutUrl, { method: 'POST', credentials: 'include' }).then(json);
  },
  beneficiaries(params = {}) {
    const q = new URLSearchParams(params).toString();
    const url = `${API}/beneficiaries?${q}`;
    console.log('Fetching beneficiaries from:', url);
    return fetch(url, { credentials: 'include' }).then(json);
  },
  beneficiary(id) {
    return fetch(`${API}/beneficiaries/${id}`, { credentials: 'include' }).then(json);
  },
  validateBeneficiary(id, body) {
    return fetch(`${API}/beneficiaries/${id}/validate`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' }).then(json);
  },
  donations(params = {}) {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API}/donations?${q}`, { credentials: 'include' }).then(json);
  },
  donation(id) {
    return fetch(`${API}/donations/${id}`, { credentials: 'include' }).then(json);
  },
  updateDonation(id, body) {
    return fetch(`${API}/donations/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' }).then(json);
  },
  exportBeneficiaries() {
    return fetch(`${API}/beneficiaries/export.csv`, { credentials: 'include' }).then(r => r.text());
  },
  exportDonations() {
    return fetch(`${API}/donations/export.csv`, { credentials: 'include' }).then(r => r.text());
  },
  // New: requests endpoints
  requests(params = {}) {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API}/requests?${q}`, { credentials: 'include' }).then(json);
  },
  exportRequests() {
    return fetch(`${API}/requests/export.csv`, { credentials: 'include' }).then(r => r.text());
  }
};
