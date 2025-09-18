import { api } from './apiClient';

export function registerUser(payload) {
  // payload: { name,email,senha,telefone,endereco,cidade,estado }
  return api('/auth/register', { method: 'POST', body: payload });
}

export function loginUser({ email, senha }) {
  return api('/auth/login', { method: 'POST', body: { email, senha } });
}

export function getCurrentUser() {
  return api('/auth/me');
}
