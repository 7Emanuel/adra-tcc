// Detect if we're running on Vercel or local development
const isVercel = typeof window !== 'undefined' && 
                 (window.location.hostname.includes('vercel.app') || 
                  window.location.hostname !== 'localhost');

const API = isVercel ? '/api' : '/api/admin';

async function json(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  login(password) {
    const loginUrl = isVercel ? `${API}/admin/login` : `${API}/login`;
    return fetch(loginUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), credentials: 'include' }).then(json);
  },
  logout() {
    const logoutUrl = isVercel ? `${API}/admin/logout` : `${API}/logout`;
    return fetch(logoutUrl, { method: 'POST', credentials: 'include' }).then(json);
  },
  beneficiaries(params = {}) {
    const q = new URLSearchParams(params).toString();
    return fetch(`${API}/beneficiaries?${q}`, { credentials: 'include' }).then(json);
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
