import { api } from './apiClient';

export async function createPickupSchedule(payload) {
  return api('/coletas/agendar', {
    method: 'POST',
    body: payload
  });
}
