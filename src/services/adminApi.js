const API = '/api/admin';

async function json(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  login(password) {
    return fetch(`${API}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), credentials: 'include' }).then(json);
  },
  logout() {
    return fetch(`${API}/logout`, { method: 'POST', credentials: 'include' }).then(json);
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
  }
};
